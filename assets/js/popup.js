/**
 * Popup Code
 * @param  {[type]} ) {             })( [description]
 * @return {[type]}   [description]
 */
var Popup = (function _popup() {

  var _mini_popup_wrapper = '',
  imagePath = 'images/avatars/';


  function miniPopup(aData) {

    function round(v) {
      return Math.round(v);
    }

    // Ethinicty to Image mapping
    // Values are for images based in images/avatars
    // 
    var oEthinicityImageMap = {
      "African American": "african-american",
      "Asian": "asian",
      "Caucasian": "caucasian",
      "Hispanic/Latino": "hispanic",
      "Mid-Eastern": "mid-eastern",
      "Pacific Islander": "pacific-islander",
      "Native American": "other",
      "Other": "other"
    };

    function getProfileAvatar(sGender, sEthinicty) {

      var img = oEthinicityImageMap[sEthinicty] || oEthinicityImageMap['Other'];
      // Add gender version
      // 
      return imagePath + img + '-' + (sGender == 'Male' ? 'male.png' : 'female.png');
      
    }

    function getItem(d) {
      return '<div class="profile-icon profile-icon--mini" style="background-image:url('+ getProfileAvatar(d['Gender'], d['Ethnicity']) + ');"></div>\
      <div class="miniscore miniscore--h">\
        <label class="miniscore__label">\
          H\
          <label class="miniscore__value">'+ round(d['Hardware Score']) + '</label>\
        </label>\
      </div>\
      <div class="miniscore miniscore--s">\
        <label class="miniscore__label">\
          S\
          <label class="miniscore__value">' + round(d['Software Score']) + '</label>\
        </label>\
      </div>\
      <div class="miniscore miniscore--t">\
        <label class="miniscore__label">\
          T\
          <label class="miniscore__value">' + round(d['Savviness Index']) + '</label>\
        </label>\
      </div>';
    }

    var popup = d3.select(document.createElement('div')),
    _html = '<ul class="popup__list"></ul>';

    popup.classed('popup popup--mini', true)
      .html(_html);

    // add profiles
    // 
    
    popup.select('.popup__list')
      .selectAll('li')
      .data(aData)
    .enter()
      .append('li')
      .on('click', function(d){
        console.log('clicked profile', d);
      })
      .html(function(d){
        return getItem(d);
      });

    return popup.node();
    
  }

  return {

    miniPopup: miniPopup

  }
  
})();