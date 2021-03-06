/**
 * Created by chuangchuangzhang on 2018/2/2.
 */
import Vue from 'vue'
export default {

  /**
   * Set state.apps
   * @param state
   * @param contents
   * @constructor
   */
  SET_APPS: (state, { contents }) => {
    state.apps = contents.content
  },

  /**
   * set state.app.c
   * @param state
   * @param controller
   * @constructor
   */
  SET_APP_CONTROLLER: (state, { controller }) => {
    state.app.c = controller
  },

  SET_APP_LABEL: (state, { path }) => {
    let app = state.apps.length > 0 && state.apps.filter(__ => {
      return __.url === path
    })
    state.app.label = app.length ? app[0]['label'] : ''
  },

  /**
   * set state.user
   * @param state
   * @param contents
   * @constructor
   */
  SET_USER: (state, { contents }) => {
    state.user = contents
  },

  /**
   * set state.configs
   * @param state
   * @param contents
   * @constructor
   */
  SET_CONFIGS: (state, { contents }) => {
    state.configs = contents
  },

  /**
   * 设置获取的数据
   * @param state
   * @param tableData
   * @constructor
   */
  SET_DATA: (state, { contents, target }) => {
    Vue.set(target, 'data', contents)
  },

  /**
   * Set Source Data
   * @param state
   * @param contents
   * @param target
   * @constructor
   */
  SET_SOURCE_DATA: (state, { contents, target }) => {
    Vue.set(state.sourceData, target, contents)
  },

  RESET_SOURCE_DATA: (state, { target }) => {
    Vue.delete(state.sourceData, target)
  },

  SET_FORM_SOURCE_DATA: (state, { contents, target }) => {
    let I
    for (I in contents) {
      if (target[I]) {
        Vue.set(target[I], 'dv', contents[I])
      }
    }
  },

  SET_LINE_ACTIVITY: (state, { tr }) => { // 设置表格、List活跃行
    Vue.set(tr, 'checked', !tr.checked)
  },

  SET_INACTIVE_LINES: (state, { table }) => {
    table.map(__ => {
      Vue.set(__, 'checked', false)
    })
  },

  /**
   * 设置表格中所有行的选中性
   * @param state
   * @param table
   * @param activity
   * @constructor
   */
  SET_ALL_LINE_ACTIVITY: (state, { table, activity, search = '' }) => {
    if (search && search.length > 0) {
      let filterRow = function (row) { // 过滤显示的内容
        for (let i in row) {
          if (row[i] && row[i].toString().search(search) >= 0) {
            return true
          }
        }
        return false
      }
      table.map(__ => {
        if (filterRow(__)) {
          Vue.set(__, 'checked', activity)
        }
      })
    } else {
      table.map(__ => {
        Vue.set(__, 'checked', activity)
      })
    }
  },
  /**
   *
   * @param state
   * @param reload
   * @constructor
   */
  SET_RELOAD: (state, { reload }) => { // 判断是否需要重新载入
    state.reload = reload
  },
  SET_COLLAPSE: (state, { collapse }) => { // 判断是否需要重新载入
    state.collapse = collapse
  },
  /**
   *
   * @param state
   * @constructor
   */
  SET_APP_RELOAD: (state, { reload }) => { // 判断是否需要重新载入
    state.app.reload = reload
  },

  /**
   * 设置signin标志位
   * @param state
   * @param signin
   * @constructor
   */
  SET_SIGNIN: (state, { signin }) => {
    state.signin = signin
  },

  /**
   * 重置Card-Data
   * @param state
   * @param card
   * @constructor
   */
  RESET_CARD: (state, { card }) => {
    if (card.data) {
      card.data.num = 0 // 总数量
      card.data.p = 1 // 当前页数
      card.data.pn = 0 // 总页数
      card.data.content = {}
    } else {

    }
  },

  /**
   * 设置拆单数据结构
   * @param state
   * @param contents
   * @param target
   * @constructor
   */
  SET_DISMANTLE_STRUCT: (state, { contents, target }) => {
    Vue.set(target, 'struct', contents)
  },

  SET_DISMANTLE_ORDER_PRODUCT_BOARD_PLATE: (state, { contents, target }) => {
    Vue.set(target, 'order_product_board_plate', contents.content)
  },

  SET_VALUATE_DATA: (state, { contents, target }) => {
    Vue.set(target, 'valuate', contents)
  }
}
