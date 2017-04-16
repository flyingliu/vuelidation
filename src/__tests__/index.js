import Vue         from 'vue/dist/vue.common'
import LoginView   from './login-view'
import Vuelidation from '../index'

Vue.use(Vuelidation)

describe('vuelidation', () => {
  test('plugin installed', () => {
    expect(Vuelidation.installed).toBe(true)
  })

  test('#renderMsg', () => {
    const renderedMsg = Vuelidation.renderMsg('{{ foo }}', {
      foo: 'bar',
    })

    expect(renderedMsg).toEqual('bar')
  })

  describe('component', () => {
    describe('$vuelidation', () => {
      let vm

      beforeEach(() => {
        vm = new Vue(LoginView).$mount()
      })

      test('installed', () => {
        expect(vm.$data.vuelidationErrors).toBe(null)
      })

      test('#valid', () => {
        vm.username = 'foo'
        vm.password = 'bar'

        expect(vm.$vuelidation.valid()).toBe(false)

        vm.fullName = 'fooBar'

        expect(vm.$vuelidation.valid()).toBe(true)
      })

      test('#errors', () => {
        vm.$vuelidation.valid()

        expect(Object.keys(vm.$vuelidation.errors())).toEqual(
          expect.arrayContaining(['username', 'password'])
        )

        vm.$vuelidation.reset()
        vm.$vuelidation.valid('address')

        expect(Object.keys(vm.$vuelidation.errors('address'))).toEqual(
          expect.arrayContaining([
            'address.line1',
            'address.city',
            'address.state',
            'address.zip',
          ])
        )

        expect(Object.keys(vm.$vuelidation.errors())).not.toEqual(
          expect.arrayContaining(['username', 'password'])
        )
      })

      test('#error', () => {
        expect(vm.$vuelidation.error('notDefined')).toEqual(null)

        vm.$vuelidation.valid()

        expect(vm.$vuelidation.error('username')).toEqual('Required')
        expect(vm.$vuelidation.error('password')).toEqual('Required')
      })

      test('#setErrors', () => {
        vm.$vuelidation.setErrors({
          username: ['invalid', 'duplicate'],
          password: 'invalid',
        })

        expect(vm.$vuelidation.error('username')).toEqual('Invalid')
        expect(vm.$vuelidation.error('password')).toEqual('Invalid')
      })

      test('#reset', () => {
        vm.$vuelidation.valid()
        vm.$vuelidation.reset()

        expect(vm.$vuelidation.errors()).toBe(null)
      })
    })

    test('no vuelidation options', () => {
      let vm = new Vue({
        render (h) {
          return <div></div>
        },
      }).$mount()
    })
  })
})
