import * as types from '../mutation-types/common.js'
const state = {

}
const action = {
  clickLikes ({WX,data={}}) {
    getApp().$ajax({
      httpUrl: getApp().api.likesUrl,
      data: data
    }).then(({ data }) => {
      let currentTab = WX.data.currentTab;
      WX.getPostings(currentTab);
    })
  }
}
module.exports = {
  state,
  action
}