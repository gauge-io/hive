/**
 * Popup Code
 */
var Popup = (function _popup() {

  var _mini_popup_wrapper = '',
  onProfileclick = function (){},

  oDispatch,

  // HTML Template
  // 
  profileHTML = d3.select('#popup_large_profile_tpl').html(),
  profileScoreHTML = d3.select('#profile_miniscore_tpl').html();

  Mustache.parse(profileHTML);
  Mustache.parse(profileScoreHTML);

  function miniPopup(aData, bShowOnlyCount) {

    var popup = d3.select(document.createElement('div')),
    list = d3.select(document.createElement('div')),
    oData = {};

    list.classed('popup popup--mini', true);

    // Add Header
    // 
    var firstFeature = aData[0],
    header = d3.select(document.createElement('h4')),
    sRecord = aData.length > 1 ? 'records' : 'record',
    headerText = '';

    if (bShowOnlyCount) {
      headerText = [aData.length, sRecord];
    }else{
      headerText = [aData.length, sRecord].concat(['in', _.startCase(firstFeature.City) + ',', firstFeature.State]);
    }

    headerText = headerText.join(' ');

    header.text(headerText);

    header.classed('popup__title', true);

    // add profiles
    // 
    aData = aData.map(function(d){
      return getProfileWithMetaProperties(d);
    });

    // Profile Map
    // 
    oData = d3.map(aData, function(d){
      return d.ID;
    });

    list.html(Mustache.render(profileScoreHTML, {
      profiles: aData
    }));
    
    list.selectAll('li')
    .on('click', function(d, i){
      
      var sID = this.getAttribute('data-id'),
      d = oData.get(sID);
      
      //console.log('clicked profile', d);

      // Update property;
      // 
      d.isActiveProfile = true;

      oData.set(sID, d);

      onProfileclick(oData.values(), i);
    });

    // add list to popup
    // 
    jQuery(popup.node()).append(header.node());

    jQuery(popup.node()).append(list.node());


    return popup.node();
    
  }

  function profilePopup(oData) {

    // Parse some fields
    // 
    oData.profiles = oData.profiles.map(function(d){
      // Software Score - Usage
      // 
      try {
        var metric = 'Hourly-Daily';
        d._daily = (d[metric] || '').split(',');

        metric = 'Weekly';
        d._weekly = (d[metric] || '').split(',');

        metric = 'Monthly-Yearly';
        d._yearly = (d[metric] || '').split(',');

      }catch(e){
        console.log('[ERROR]', e.message);
      }

      return d;

    });

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

        //console.log('Toggle Bookmark on Profile', this.getAttribute('data-id'));

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

        // init media carousel
        initMediaCarousel($panel[0]);
        
      });

    // Listen init media carousel event
    //
    var iMCTimer;
    oDispatch.on('profilePopupShown.carousel', function(elDom){
      
      clearTimeout(iMCTimer);

      iMCTimer = setTimeout(function(){
        initMediaCarousel(elDom);
      }, 100);
      
    });


    return el.node();
   
  }

  function initMediaCarousel(domContent) {

    var panel = d3.select(domContent),
    mySwiper = panel.select('.swiper-container').node().swiper;

    // check if already initialized
    // if so, destroy it
    // 
    if (mySwiper) {
      mySwiper.destroy(true, true);
    }

    mySwiper = new Swiper( panel.select('.swiper-container').node(), {
      
      // If we need pagination
      pagination: {
        el: panel.select('.swiper-pagination').node(),
        type: 'fraction'
      },

      // Navigation arrows
      navigation: {
        nextEl: panel.select('.swiper-button-next').node(),
        prevEl: panel.select('.swiper-button-prev').node(),
      }
      
    });
    
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