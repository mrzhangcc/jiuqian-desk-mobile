<template>
  <div class="row mt-3 j-page" :id="title">
    <div class="col-12 border-bottom rounded-bottom mb-2 border-primary text-center d-print-none"><h5>{{ label }}</h5></div>
    <div is="regular-form" v-for="(form, key, index) in formPages" :form="form" :key="index" v-if="formPages.length && isActive"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import RegularForm from '@/components/forms/RegularForm'
import { nameToId } from '@/assets/js/custom'

export default {
  name: 'Add',
  props: {
    f: {
      type: String
    },
    c: {
      type: String
    }
  },
  provide () {
    return {
      reload: this.reload
    }
  },
  data () {
    return {
      title: '',
      isActive: true
    }
  },
  computed: {
    ...mapGetters({
      formPages: 'currentFormPages',
      label: 'currentLabel'
    })
  },
  created () {
    this.set_app_controller()
    window.document.title = this.label + '|' + window.document.title.split('|').pop()
  },
  updated () {
    window.document.title = this.label + '|' + window.document.title.split('|').pop()
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.title = nameToId(vm.c)
    })
  },
  watch: {
    '$route': function (to, from) { // route变化时更新数据
      this.title = nameToId(this.c)
      this.set_app_controller()
    }
  },
  methods: {
    set_app_controller () {
      this.$store.commit('SET_APP_CONTROLLER', { controller: this.c })
    },
    reload () {
      this.isActive = false
      this.$nextTick(function () {
        this.isActive = true
      })
    }
  },
  components: {
    RegularForm
  }
}
</script>
