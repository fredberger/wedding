// import Vue from 'vue'
import Vue from 'vue/dist/vue.esm'
import axios from 'axios';

document.addEventListener('DOMContentLoaded', () => {
  const app = new Vue({
    el: '#app',
    data: {
      list: [],
      selected: null,
      name: '',
      attend: true,
      finished: false,
      msgSent: false
    },
    mounted: function () {
      var that = this;
      var token = document.getElementsByName('csrf-token')[0].getAttribute('content')
      axios.defaults.headers.common['X-CSRF-Token'] = token
      axios.get(`/guests`
      ).then(function(response) {
        that.list = response.data.guests
      }).catch(function(error) {
        console.log(error)
      })
    },
    computed: {
      hasGuest: function () {
        if (this.attend !== false && this.selected && this.selected.invited > 0 && !this.selected.attend) {
          document.getElementsByClassName('has-guest')[0].classList.remove('hidden')
          return true
        }
        return false
      },
      notSent: function () {
        return !this.msgSent
      },
      notFinished: function () {
        return !this.finished
      }
    },
    methods: {
      keymonitor: function (event) {
        var that = this
        const found = that.list.find((l) => l.name.normalize('NFD').replace(/\s/g,'').replace(/[\u0300-\u036f]/g, "").toLowerCase() === that.name.normalize('NFD').replace(/\s/g,'').replace(/[\u0300-\u036f]/g, "").toLowerCase())

        if (found) {
          that.selected = found
        } else {
          that.selected = null
        }

        document.getElementsByClassName('guest_name')[0].classList.remove('error')
        document.getElementsByClassName('guest_phone')[0].classList.remove('error')
      },
      willAttend: function (data) {
        var that = this
        that.attend = data
      },
      sendMsg: function () {
        var self = this
        var token = document.getElementsByName('csrf-token')[0].getAttribute('content')
        axios.defaults.headers.common['X-CSRF-Token'] = token
        var gift_msg = document.getElementsByClassName('gift_msg')[0]
        axios.post('/messages/', {
          message: {
            body: gift_msg.value
          }
        }).then(function (response) {
          self.msgSent = true
          console.log(response)
        }).catch(function (error) {
          console.log(error)
        })
      },
      sendForm: function () {
        var self = this
        var token = document.getElementsByName('csrf-token')[0].getAttribute('content')
        axios.defaults.headers.common['X-CSRF-Token'] = token
        var guest = {
          attend: self.attend
        }

        var guest_name = document.getElementsByClassName('guest_name')[0]
        if (guest_name) {
          guest.name = guest_name.value
        }
        var guest_phone = document.getElementsByClassName('guest_phone')[0]
        if (guest_phone) {
          guest.phone = guest_phone.value
        }
        guest_name.classList.remove('error')
        guest_phone.classList.remove('error')
        var has_error = false
        if (self.attend && guest.phone === "") {
          guest_phone.classList.add('error')
          has_error = true
        }
        if (guest.name === "" || !self.selected || self.selected.attend) {
          guest_name.classList.add('error')
          has_error = true
        }
        if (has_error) {
          return
        }
        var guest_list = Array.from(document.getElementsByClassName('guest_list'))
        var guests = []
        for (var guest of guest_list) {
          guests.push(guest.value)
        }
        axios.put('/guests/' + self.selected.id, {
          guest: {
            name: guest_name,
            phone: guest_phone,
            attend: self.attend,
            list: guests
          }
        }).then(function (response) {
          self.finished = true
          console.log(response)
        }).catch(function (error) {
          console.log(error)
        })
      }
    }
  })
})
