<template>
  <div class="col-md-3 mb-2 mb-md-3 d-print-none">
    <form @submit.prevent="qrcodeSubmit($event.target)">
      <div class="input-group" id="pageSearch" v-if="error">
        <div class="input-group-prepend">
          <button class="btn btn-outline-secondary" type="button" data-toggle="modal" data-target="#pageSearchModal"><i class="fa fa-search"></i></button>
        </div>
        <input type="hidden" name="thick" v-model="pageSearches['thick'].dv" />
        <input type="hidden" name="qrcode"  v-model="pageSearches['qrcode'].dv" />
        <input type="search" class="form-control" name="keyword" id="scanBoardQrcode" v-model="keyword" placeholder="扫描板块二维码"/>
        <div class="input-group-append">
          <button class="btn btn-outline-secondary" type="submit">Go!</button>
        </div>
      </div>
    </form>
    <div is="RegularModal" :modal="modal"></div>
  </div>
</template>

<script>
import FormGroupInput from '@/components/forms/FormGroupInput'
import FormGroupSelect from '@/components/forms/FormGroupSelect'
import RegularModal from '@/components/modals/RegularModal'
import $ from 'jquery'
export default {
  name: 'ScanBoardPageSearch',
  props: {
    pageSearches: {
      type: [Array, Object],
      required: true
    },
    qrcodeFocus: {
      type: Boolean
    }
  },
  data () {
    return {
      keyword: ''
    }
  },
  computed: {
    modal: {
      get () {
        return {
          target: '#pageSearchModal',
          label: '搜索设置',
          forms: this.pageSearches,
          modal_type_v: 'filter'
        }
      }
    },
    error: {
      get () {
        return !(JSON.stringify(this.pageSearches) === '{}' || JSON.stringify(this.pageSearches) === '[]' || JSON.stringify(this.pageSearches) === '')
      }
    }
  },
  watch: {
    qrcodeFocus: {
      handler: function (to, from) {
        $('#scanBoardQrcode').focus()
      }
    }
  },
  methods: {
    qrcodeSubmit ($E) {
      this.pageSearches['qrcode'].dv = this.keyword
      this.keyword = ''
      this.$emit('search', $E)
    }
  },
  components: {
    FormGroupInput,
    FormGroupSelect,
    RegularModal
  }
}
</script>
