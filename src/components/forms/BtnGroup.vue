<template>
  <div class="btn-group mb-2 mb-md-3" role="group" :data-table="target">
    <button :id="id" type="button" class="btn btn-danger dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      共选中<span id="tableSelected" data-num="">{{ activeLineLength }}</span>项
      <span class="caret"></span>
    </button>
    <div class="dropdown-menu" :aria-labelledby="id">
      <a class="dropdown-item mt-1 mb-1" v-for="(func, key, index) in funcGroup.funcs" :key="uuid(index)" :href="disposeUri(func)" :target="func.toggle_v === 'blank' ? '_blank' : '_self'"  :data-toggle="func.toggle_name" :data-target="func.target" :data-multiple=!!parseInt(func.multiple_v) :data-single=!!parseInt(func.single_v) :data-source="func.source" :data-query="func.query" @click="btnGroupAClick"><i class="mr-1" :class="func.img"></i>{{ func.label }}</a>
    </div>
  </div>
</template>

<script>
import { uuid, dataToStr } from '@/assets/js/custom'
import $ from 'jquery'
import service from '@/axios'
import { baseUrl } from '@/axios/env'
import { trimRight } from 'voca'

export default {
  name: 'btn-group',
  props: {
    funcGroup: {
      type: [Array, Object],
      required: true
    },
    index: {
      required: true
    },
    target: {
      required: true
    }
  },
  computed: {
    activeLineLength: {
      get () {
        return this.$store.getters.currentPageActiveLineLength({ source: this.target })
      }
    },
    id: {
      get () {
        return 'btnGroupDrop' + this.index
      }
    }
  },
  created () {
  },
  methods: {
    uuid (index) {
      return index + uuid()
    },
    // dataStr (data) {
    //   let DataStr = ''
    //   Object.keys(data).forEach(key => {
    //     DataStr += key + '=' + data[key] + '&'
    //   })
    //   return DataStr
    // },
    btnGroupAClick (event) {
      let Toggle = $(event.currentTarget).data('toggle')
      switch (Toggle) {
        case 'child':
          this.func_child(event.currentTarget) || event.preventDefault()
          break
        case 'backstage':
          event.preventDefault()
          this.func_backstage(event.currentTarget)
          break
        case 'save':
          event.preventDefault()
          this.func_save(event.currentTarget)
          break
        case 'blank':
          this.func_blank(event.currentTarget) || event.preventDefault()
          break
      }
    },
    func_child (E) {
      let Data = {}
      let [ Query = null, Keys = null, Search = null ] = $(E).data('query').split('-')
      Query = Query ? Query.split(',') : null
      Keys = Keys ? Keys.split(',') : null
      Search = Search ? Search.split(',') : null

      if (Query) {
        let QueryValue = this.$store.getters.currentPageQuery({source: $(E).data('target') || '', query: Query})
        Data = { ...Data, ...QueryValue }
      }
      if (Search) {
        let SearchValues = this.$store.getters.currentPageSearchSearchValues({search: Search})
        Data = { ...Data, ...SearchValues }
      }
      if ($(E).data('multiple') || $(E).data('single')) {
        let V = this.$store.getters.currentPageActiveLineVs({source: $(E).data('target') || '', all: $(E).data('multiple') || false}).map(__ => __.v)
        if (V && V.length !== 0) {
          if ($(E).data('single')) {
            V = V.pop()
          }
          Data['v'] = V
          if (Keys) {
            Data['relate'] = this.$store.getters.currentPageActiveLineVs({source: $(E).data('target') || '', all: false, keys: Keys})
          }
        } else {
          alert('请先选中!!')
          return false
        }
      }
      let DataStr = dataToStr(Data)

      $(E).attr('href', function (index, attr) {
        return attr.indexOf('?') >= 0 ? attr.substr(0, attr.lastIndexOf('?')) + '?' + DataStr : attr + '?' + DataStr
      })
      return true
    },
    async func_backstage (E) {
      let Data = {}
      if ($(E).data('multiple') || $(E).data('single')) {
        if ($(E).data('target')) {
          let Target = $(E).data('target')
          let [ Query, Keys ] = $(E).data('query') ? $(E).data('query').split('-') : [ null, null ]
          Query = Query !== '' && Query ? Query.split(',') : null
          Keys = Keys !== '' && Keys ? Keys.split(',') : null
          let V = this.$store.getters.currentPageActiveLineVs({source: Target, all: $(E).data('multiple')}).map(__ => __.v)
          if (V.length !== 0) {
            if ($(E).data('single')) {
              V = V.pop()
            }
            if (confirm('确定执行' + $(E).text() + '操作?')) {
              Data['v'] = V
              if (Keys) {
                Data['relate'] = this.$store.getters.currentPageActiveLineVs({source: Target, all: false, keys: Keys})
              }
              if (Query) {
                let QueryValue = this.$store.getters.currentPageQuery({source: Target, query: Query})
                Data = { ...Data, ...QueryValue }
              }
            } else {
              return false
            }
          } else {
            alert('请先选中')
            return false
          }
        } else {
          console.log('没有定义Target')
        }
      }
      let postReturn = await service.post($(E).attr('href'), Data)
      if (!postReturn.code) {
        if (postReturn.location !== '') {
          if (postReturn.confirm !== '') {
            if (window.confirm(postReturn.confirm)) {
              this.$router.push(postReturn.location)
            }
          } else {
            this.$router.push(postReturn.location)
          }
        } else {
          this.$store.commit('SET_APP_RELOAD', { reload: true })
          return true
        }
      } else {
        alert(postReturn.message)
        return false
      }
    },
    func_save (E) {

    },
    func_blank (E) {
      let Data = this.parseData(E)
      if (Data !== false && Data !== undefined) {
        let DataStr = dataToStr(Data)
        DataStr = trimRight(DataStr, '&')
        $(E).attr('href', function (index, attr) {
          return attr.indexOf('?') >= 0 ? attr.substr(0, attr.lastIndexOf('?')) + '?' + DataStr : attr + '?' + DataStr
        })
        return true
      } else {
        return false
      }
    },
    parseData (E) {
      let Data = {}
      let [ Query = null, Keys = null, Search = null ] = $(E).data('query').split('-')
      Query = Query ? Query.split(',') : null
      Keys = Keys ? Keys.split(',') : null
      Search = Search ? Search.split(',') : null
      if (Query) {
        let QueryValue = this.$store.getters.currentPageQuery({source: $(E).data('target') || '', query: Query})
        Data = { ...Data, ...QueryValue }
      }
      if (Search) {
        let SearchValues = this.$store.getters.currentPageSearchSearchValues({search: Search})
        Data = { ...Data, ...SearchValues }
      }
      if ($(E).data('multiple') || $(E).data('single')) {
        let V = this.$store.getters.currentPageActiveLineVs({source: $(E).data('target') || '', all: $(E).data('multiple') || false}).map(__ => __.v)
        if (V && V.length !== 0) {
          Data['v'] = V
          if (Keys) {
            // Data['relate'] = this.$store.getters.currentPageActiveLineVs({source: $(E).data('target') || '', all: $(E).data('multiple'), keys: Keys})
            let Relate = this.$store.getters.currentPageActiveLineVs({source: $(E).data('target') || '', all: $(E).data('multiple'), keys: Keys})
            if ($(E).data('single')) {
              Relate = Relate.shift()
              Data = { ...Data, ...Relate }
            } else {
              Data['relate'] = Relate
            }
          }
        } else {
          alert('请先选中!!')
          return false
        }
      }
      return Data
    },
    disposeUri (func) {
      if (func.toggle_name === 'child') {
        return '#' + func.url
      } else {
        return baseUrl + func.url
      }
    }
  }
}
</script>
