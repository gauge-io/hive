/**
 * Popup Code
 * @param  {[type]} ) {             })( [description]
 * @return {[type]}   [description]
 */
var Popup = (function _popup() {

  var _mini_popup_wrapper = '',
  imagePath = 'images/avatars/',
  onProfileclick = function (){};


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
        onProfileclick(d);
      })
      .html(function(d){
        return getItem(d);
      });

    return popup.node();
    
  }

  function profilePopup(aData) {

    /*
    <div class="profilepanel">

      <div class="profilepanel__toolbar pbar">
        <h3 class="pbar__left">ID13: Marilyn</h3>

        <h3 class="pbar__center">Retail, Owner</h3>

        <div class="pbar__right">Bookmark</div>
      </div>

      <div class="profilepanel__head phead">
        <div class="phead__img avatar-img"></div>
        <div class="phead__attributes">
          <ul>
            <li>Female, 60-64, Caucasian</li>
            <li>Single, Owner</li>
            <li>Self-Employed</li>
            <li>0 Children in Home</li>
            <li>Android Phone</li>
            <li>Some College, $50k-$74.9k</li>
          </ul>
        </div>

      </div>

      <div class="profilepanel__body pbody">

        <ul class="accordion">
          <li class="accordion__item">
            <input type="checkbox" checked>
            <i></i>
            <div class="aitem__head ahbar">
              <h2 class="ahbar__left">Hardware Adoption</h2>
              <h2 class="ahbar__right">12</h2>
            </div>

            <div class="aitem__body">
              <ul class="list list--inline">
                <li>TVs ()</li>
                <li>TVs ()</li>
                <li>TVs ()</li>
                <li>TVs ()</li>
                <li>TVs ()</li>
              </ul>
            </div>
          </li>
          <li class="accordion__item">
            <input type="checkbox" checked>
            <i></i>
            <div class="aitem__head ahbar">
              <h2 class="ahbar__left">Software Adoption</h2>
              <h2 class="ahbar__right">12</h2>
            </div>
            <div class="aitem__body">
              <div class="colflex">
                <div>
                  <h4>Hourly/Daily</h4>
                  <ul class="list">
                    <li>Social Media</li>
                    <li>Social Media</li>
                    <li>Social Media</li>
                  </ul>
                </div>
                <div>
                  <h4>Weekly</h4>
                  <ul class="list"></ul>
                </div>

                <div>
                  <h4>Monthly/Yearly</h4>
                  <ul class="list">
                    <li>Social Media</li>
                    <li>Social Media</li>
                  </ul>
                </div>

              </div>
            </div>
          </li>
          <li class="accordion__item">
            <input type="checkbox" checked>
            <i></i>
            <div class="aitem__head ahbar">
              <h2 class="ahbar__left">Tech Savviness</h2>
              <h2 class="ahbar__right">12</h2>
            </div>
            <div class="aitem__body">
              <ul class="list list--block">
                <li>TVs ()</li>
                <li>TVs ()</li>
                <li>TVs ()</li>
                <li>TVs ()</li>
                <li>TVs ()</li>
              </ul>
            </div>
          </li>
        </ul>

      </div>

    </div>
    */
   
    return '<div class="profilepanel"> <div class="profilepanel__toolbar pbar"> <h3 class="pbar__left">ID13: Marilyn</h3> <h3 class="pbar__center">Retail, Owner</h3> <div class="pbar__right">Bookmark</div> </div> <div class="profilepanel__head phead"> <div class="phead__img avatar-img"></div> <div class="phead__attributes"> <ul> <li>Female, 60-64, Caucasian</li> <li>Single, Owner</li> <li>Self-Employed</li> <li>0 Children in Home</li> <li>Android Phone</li> <li>Some College, $50k-$74.9k</li> </ul> </div> </div> <div class="profilepanel__body pbody"> <ul class="accordion"> <li class="accordion__item"> <input type="checkbox" checked> <i></i> <div class="aitem__head ahbar"> <h2 class="ahbar__left">Hardware Adoption</h2> <h2 class="ahbar__right">12</h2> </div> <div class="aitem__body"> <ul class="list list--inline"> <li>TVs ()</li> <li>TVs ()</li> <li>TVs ()</li> <li>TVs ()</li> <li>TVs ()</li> </ul> </div> </li> <li class="accordion__item"> <input type="checkbox" checked> <i></i> <div class="aitem__head ahbar"> <h2 class="ahbar__left">Software Adoption</h2> <h2 class="ahbar__right">12</h2> </div> <div class="aitem__body"> <div class="colflex"> <div> <h4>Hourly/Daily</h4> <ul class="list"> <li>Social Media</li> <li>Social Media</li> <li>Social Media</li> </ul> </div> <div> <h4>Weekly</h4> <ul class="list"></ul> </div> <div> <h4>Monthly/Yearly</h4> <ul class="list"> <li>Social Media</li> <li>Social Media</li> </ul> </div> </div> </div> </li> <li class="accordion__item"> <input type="checkbox" checked> <i></i> <div class="aitem__head ahbar"> <h2 class="ahbar__left">Tech Savviness</h2> <h2 class="ahbar__right">12</h2> </div> <div class="aitem__body"> <ul class="list list--block"> <li>TVs ()</li> <li>TVs ()</li> <li>TVs ()</li> <li>TVs ()</li> <li>TVs ()</li> </ul> </div> </li> </ul> </div> </div>';
  }

  return {

    miniPopup: miniPopup,

    profilePopup: profilePopup,

    onProfileclick: function(fn){
      onProfileclick = fn;
    }

  }
  
})();