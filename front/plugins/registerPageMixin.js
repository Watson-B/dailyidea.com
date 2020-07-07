import nanoid from 'nanoid'

export default {
  data() {
    return {
      email: '',
      name: '',
      emailExistsMsg: '',
      registerInProgress: false
    }
  },
  mounted() {},
  methods: {
    async signup() {
      try {
        this.emailExistsMsg = ''
        // Validate input fields
        this.registerInProgress = true
        await this.$store.dispatch('cognito/registerUser', {
          username: this.email.toLowerCase(),
          password: nanoid(),
          attributes: {
            name: this.name
          }
        })
        await this.$amplifyApi.post('RequestLogin', '', {
          body: { email: this.email.toLowerCase() }
        })

        // Redirect to registeration success page
        this.$router.push({
          name: 'auth-signup-success',
          params: { email: this.email.toLowerCase() }
        })
      } catch (e) {
        // Handle email already registered
        if (e.code && e.code === 'UsernameExistsException') {
          this.registerInProgress = false
          this.emailExistsMsg =
            "Oops! It looks like there's already an account with that email address."
        }
      }
    }
  }
}
