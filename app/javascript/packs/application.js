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
      finished: false
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
        if (this.selected && this.selected.invited > 0 && !this.selected.attend) {
          document.getElementsByClassName('has-guest')[0].classList.remove('hidden')
          return true
        }
        return false
      },
      notFinished: function () {
        return !this.finished
      }
    },
    methods: {
      keymonitor: function (event) {
        var that = this
        const found = that.list.find((l) => l.name.toLowerCase() === that.name.toLowerCase())

        if (found) {
          that.selected = found
        } else {
          that.selected = null
        }
      },
      willAttend: function (data) {
        var that = this
        that.attend = data
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
          has_error = true
        }
        guest_phone.classList.add('error')
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
