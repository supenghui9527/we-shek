import * as types from '../mutation-types/common.js'
const state = {

}
const action = {
  clickLikes ({MINA,data={}}) {
    getApp().$ajax({
      httpUrl: getApp().api.likesUrl,
      data: data
    }).then(({ data }) => {
      let currentTab = MINA.data.currentTab;
      MINA.getPostings(currentTab);
    })
  }
}
module.exports = {
  state,
  action
}