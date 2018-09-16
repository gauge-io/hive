/**
 * Popup Code
 * @param  {[type]} ) {             })( [description]
 * @return {[type]}   [description]
 */
var Popup = (function _popup() {

  var _mini_popup_wrapper = '',
  imagePath = 'images/avatars/',
  onProfileclick = function (){},

  oDispatch,

  // HTML Template
  // 
  profileHTML = d3.select('#popup_large_profile_tpl').html();

  Mustache.parse(profileHTML);

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

  function round(v) {
    return Math.round(v);
  }


  function miniPopup(aData) {

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
      .on('click', function(d, i){
        console.log('clicked profile', d);
        // Update property;
        // 
        pData = aData.map(function(p, j){
          p.isActiveProfile = j == i;
          p.tsp = getTechSavvinessPoints(p);
          p._avatar = getProfileAvatar(p['Gender'], p['Ethnicity']);
          return p;
        });
        onProfileclick(pData, i);
      })
      .html(function(d){
        return getItem(d);
      });

    return popup.node();
    
  }

  function profilePopup(oData) {

    // creat a wrapper div and add popup html
    // 
    var el = d3.select(document.createElement('div'))
      .html(Mustache.render(profileHTML, oData));

    // Bind Events
    // 

    // Toggle Profile Bookmark
    // 
    el.selectAll('.profilepanel__bookmark')
      .on('click', function(d){
        // get profile ID
        // 
        var btn = jQuery(this);

        console.log('Toggle Bookmark on Profile', this.getAttribute('data-id'));

        // trigger bookmark event
        // 
        oDispatch.apply('toggleBookmark', null, [{
          ID: this.getAttribute('data-id')
        }]);

        // Toggle class
        // 
        if (btn.hasClass('profilepanel__bookmark--active')) {
          btn.removeClass('profilepanel__bookmark--active');
        }else{
          btn.addClass('profilepanel__bookmark--active');
        }

      });

    // Go Back to Profile Listing
    // 
    el.selectAll('.profilepanel__back')
      .on('click', function(d){
        
        // Remove active class
        // 
        jQuery('.popup--activeprofile')
          .removeClass('popup--activeprofile');

        jQuery('.profilepanel--active')
          .removeClass('profilepanel--active');
        
      });

    // Make a Profile Active
    // 
    el.selectAll('.profilepanel--handle')
      .on('click', function(d){
        
        // If not already active class
        //
        var $panel = jQuery(this).closest('.profilepanel');
        if (!$panel.hasClass('profilepanel--active')) { 
          jQuery('.popup--large')
            .addClass('popup--activeprofile');

          $panel
            .addClass('profilepanel--active');
        }
        
      });




      return el.node();
   
  }

  return {

    miniPopup: miniPopup,

    profilePopup: profilePopup,

    onProfileclick: function(fn){
      onProfileclick = fn;
    },

    setDispatch: function(od){
      if (!!od) {
        oDispatch = od;
      }
    }

  }
  
})();