<template>
  <div class="form-group">
    <label :for="id">{{ configs.label }}<span v-if="required">*</span></label>
    <input type="hidden" :name="configs.name" class="form-control auto-complete-val" :id="id" v-model="autoCompleteValue" :required="required" :max="max" :min="min" :maxlength="maxlength" :pattern="pattern" />
    <input class="form-control auto-complete" name="auto_complete" :id="autoCompleteId" type="text" :readonly="readonly" :required="required" :placeholder="placeholder" v-model="autoCompleteText" />
  </div>
</template>

<script>
import $ from 'jquery'
import service from '@/axios'
import '@/assets/js/autocomplete'
import { nameToId, uuid } from '@/assets/js/custom'

let formatItem = function (row) {
  return row.name
}
let self = {}

export default {
  name: 'FormGroupRemote',
  props: {
    configs: {
      type: [Array, Object],
      required: true
    },
    forms: {
      type: [Array, Object],
      required: true
    },
    forceReadonly: {
      type: [Boolean],
      required: true
    },
    query: {
      type: [Array, Object]
    }
  },
  data () {
    return {
      id: '',
      autoCompleteId: '',
      autoCompleteText: '',
      queryStr: '',
      params: [],
      paramsValue: {},
      related: [],
      relatedValue: {}
    }
  },
  computed: {
    autoCompleteValue: {
      get () {
        return this.configs.dv
      },
      set (value) {
        this.configs.dv = value
      }
    },
    readonly () {
      return this.forceReadonly || this.configs.readonly_v === '1'
    },
    required () {
      return this.configs.required_v === '1'
    },
    max () {
      return this.configs.max === '' ? false : this.configs.max
    },
    min () {
      return this.configs.min === '' ? false : this.configs.min
    },
    maxlength () {
      return this.configs.maxlength !== '0' ? this.configs.maxlength : ''
    },
    pattern () {
      return this.configs.pattern === '' ? false : this.configs.pattern
    },
    placeholder () {
      return this.configs.placeholder
    }
  },
  created () {
    this.id = nameToId(this.configs.name) + uuid()
    this.autoCompleteId = this.id + 'AutoComplete'
    this.parseQuery()
  },
  mounted () {
    self[this.autoCompleteId] = this
    this.autoComplete()
  },
  methods: {
    parseQuery () {
      if (this.configs.query) {
        this.queryStr = this.configs.query
        this.initQuery()
      }
    },
    initQuery () {
      if (this.queryStr) {
        if (this.$router.currentRoute.query[this.queryStr] !== undefined) {
          this.autoCompleteValue = this.$router.currentRoute.query[this.queryStr]
        }
        this.watchQuery()
      }
    },
    watchQuery () {
      this.$watch('query', function (to, from) {
        if (this.query[this.queryStr] !== undefined && this.query[this.queryStr] !== this.autoCompleteValue) {
          this.autoCompleteValue = this.query[this.queryStr]
        }
      }, {
        deep: true
      })
    },

    autoComplete () {
      if (this.configs && this.configs.url) {
        let url = this.configs.url
        $('#' + this.autoCompleteId).autocomplete({
          minLength: 0,
          autoselect: true,
          showHint: false,
          appendMethod: 'replace',
          source: [
            function (q, add) {
              service.get(url, { params: { keyword: encodeURIComponent(q) } }).then(function (data) {
                if (data.code > 0) {
                  add([])
                } else {
                  add([])
                  add(data.contents)
                }
              })
            }
          ],
          valueKey: 'name',
          getValue: formatItem,
          getTitle: formatItem
        }).on('selected.xdsoft', function (e, row) {
          self[this.id].autoCompleteValue = row.v
          self[this.id].autoCompleteText = row.name
        })
      }
    }
  }
}
</script>
