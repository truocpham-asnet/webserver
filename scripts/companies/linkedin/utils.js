/**
 * Provide core methods of scraping
 */
'use strict';

var _ = require('underscore'),
    fs = require('fs'),
    Services;

/**
 * Define methods
 */
Services = {
  /**
   * Get scrap link by sector id
   */
  getURLBySectorId: function (code) {
    if (!this.industries)
      this.init();

    var item = _.findWhere(this.industries, {code: code}) || {};

    return item.url;
  },

  /**
   * Init sector id look up
   */
  init: function () {
    // init industries
    this.industries = fs.readFileSync(__dirname + '/data/industries.json');
    this.industries = this.industries ? JSON.parse(this.industries) : [];
  },

  /**
   * Format Href
   */
  formatHref: function (arr) {
    var self = this,
        result = [];

    // reduce arr
    _.reduce(arr, function (memo, link) {
      if (link && typeof link === 'string')
        memo.push(self.replaceHtmlEntites(link.split('href=')[1].replace(/\\"/g, '')));

      return memo;
    }, result);

    return result;
  },

  /**
   * Get company prefix url
   */
  fillCompanyURLPrefix: function (arr) {
    var result = [];

    _.reduce(arr, function (memo, link) {
      if (link && typeof link === 'string')
        memo.push('http://www.linkedin.com' + link);

      return memo;
    }, result);

    return result;
  },

  /**
   * Get sector sub url
   */
  getSubURL: function (data) {
    var regexp = new RegExp(/<ul class=\\"directory\\">.*<\/ul>/),
        arr = regexp.exec(data);

    arr = arr ? arr[0] : '';

    // get links
    var getLinkRegExp = new RegExp(/href=\\"[^\\"]*\\"/g),
        links = arr.match(getLinkRegExp),
        result = this.formatHref(links);

    // fill prefix
    result = this.fillCompanyURLPrefix(result);

    return result;
  },

  /**
   * Get Linkedin URL
   */
  getLinkedinURL: function (data) {
    var regexp = new RegExp(/href=\\"\/company\/[^\\"]*\\"/g),
        links = data.match(regexp),
        result = this.formatHref(links);

    // process company link
    result = this.fillCompanyURLPrefix(result);

    return result;
  },

  /**
   * Get company id
   */
  getCompanyId: function (data) {
    var regexp = new RegExp(/companyId=[^&]*&/g),
        ids = data.match(regexp),
        id,
        mode,
        mapping = {},
        mappingArray = [];

    // create id mapping
    _.each(ids, function (item) {
      if (mapping[item])
        mapping[item] += 1;
      else
        mapping[item] = 1;
    });

    // create mapping array
    _.each(mapping, function (value, key) {
      mappingArray.push({
        'key': key,
        'value': value
      });
    });

    // get mode of mapping array
    mode = _.max(mappingArray, function (item) { return item.value; });

    // get id from mode string
    if (mode && typeof mode === 'object')
      id = mode['key'].split('=')[1].replace('&', '');

    return id;
  },

  /**
   * Get company name id
   */
  getCompanyNameId: function (data) {
    data = data || '';

    return data.split('http://www.linkedin.com/company/')[1];
  },

  // replace special character
  replaceHtmlEntites: function (str) {
    var translate_re = /&(nbsp|amp|quot|lt|gt);/g;
    var translate = {
      "nbsp": " ",
      "amp" : "&",
      "quot": "\"",
      "lt"  : "<",
      "gt"  : ">"
    };

    return str.replace(translate_re, function (match, entity) {
      return translate[entity];
    });
  },

  /**
   * Get company name
   */
  getCompanyName: function (data) {
    var regexp = new RegExp(/.*<title>([^<]*)<\/title>.*/g),
        name = data.replace(regexp, '$1');

    if (name && name !== '') {
      name = _.unescape(name.replace('| LinkedIn', '').trim());
    }

    console.log(name);
    return name;
  },

  /**
   * Get company info from company detail page
   */
  getCompanyInfo: function (data) {
    // stringify input data
    data = JSON.stringify(data);

    var type,
        size,
        industry,
        founded,
        streets = [],
        locality,
        postalCode,
        website,
        country,
        linkedinId = this.getCompanyId(data),
        str = '',
        htmlparser = require('htmlparser2'),
        name;

    var parser = new htmlparser.Parser({
        onopentag: function (name, attribs){
          var className = attribs.class || '';

          if (name === 'dd')
            str += '<ddinfo>';
          else if (name === 'dt')
            str += '<dtinfo>';
          else if (name === 'span')
            str += '<span' + className + '>';
          else if (name === 'h1')
            str += '<companyname>';
        },
        ontext: function (text) {
          str += text;
        },
        onclosetag: function(tagname) {
          if (tagname === 'dd')
           str += '</ddinfo>' + '\n';
          else if (tagname === 'dt')
            str += '</dtinfo>';
          else if (tagname === 'span')
            str += '</span>';
          else if (tagname === 'h1')
            str += '</companyname>';
        }

    });

    parser.write(data);
    parser.end();

    // console.log(str)

    // process the str
    var infoRegExp = new RegExp(/(<dtinfo>.*<\/ddinfo>)/g),
        headquarterRegExp = new RegExp(/<span[^<]*<\/span>/g),
        nameRegExp = new RegExp(/<companyname>[^<]*<\/companyname>/g),
        matchInfo = str.match(infoRegExp),
        matchHeadquarter = str.match(headquarterRegExp),
        matchName = str.match(nameRegExp);

    // console.log(matches)
    // get info from matches
    _.each(matchInfo, function (item) {
      // console.log(item)
      if (item.indexOf('Type') !== -1) {
        type = item.replace(/.*<ddinfo>([^<]*)<\/ddinfo>/g, '$1');
        type = type.replace(/\\n/g, '').trim();
      } else if (item.indexOf('Company Size') !== -1) {
        size = item.replace(/.*<ddinfo>([^<]*)<\/ddinfo>/g, '$1');
        size = size.replace(/\\n/g, '').trim();
      } else if (item.indexOf('Website') !== -1) {
        website = item.replace(/.*<ddinfo>([^<]*)<\/ddinfo>/g, '$1');
        website = website.replace(/\\n/g, '').trim();
      } else if (item.indexOf('Industry') !== -1) {
        industry = item.replace(/.*<ddinfo>([^<]*)<\/ddinfo>/g, '$1');
        industry = industry.replace(/\\n/g, '').trim();
      } else if (item.indexOf('Founded') !== -1) {
        founded = item.replace(/.*<ddinfo>([^<]*)<\/ddinfo>/g, '$1');
        founded = founded.replace(/\\n/g, '').trim();
      }
    });

    // get headquarter
    _.each(matchHeadquarter, function (item, i) {
      // console.log(item)
      if (item.indexOf('street-address') !== -1) {
        streets[i] = item.replace(/.*>([^<]*)<\/span>/g, '$1');
      } else if (item.indexOf('locality') !== -1) {
        locality = item.replace(/.*>([^<]*)<\/span>/g, '$1').replace(',', '');
      } else if (item.indexOf('postal-code') !== -1) {
        postalCode = item.replace(/.*>([^<]*)<\/span>/g, '$1');
      } else if (item.indexOf('country-name') !== -1) {
        country = item.replace(/.*>([^<]*)<\/span>/g, '$1');
      }
    });

    // get linkedin company name
    _.each(matchName, function (item) {
      name = _.unescape(item.replace(/<companyname>([^<]*)<\/companyname>/g, '$1'));
      name = name.replace(/\\n/g, '');
    });

    return {
      'name': name,
      'linkedinId': linkedinId,
      'type': type,
      'size': size,
      'website': website,
      'industry': industry,
      'founded': founded,
      'streets': _.compact(streets),
      'locality': locality,
      'postalCode': postalCode,
      'country': country
    };
  }
};

/**
 * Expose
 */
module.exports = Services;
