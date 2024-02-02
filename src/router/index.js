import Vue from 'vue'
import VueRouter from 'vue-router'
// import HomeView from '../views/HomeView.vue'
// import UserList from '../views/UserList.vue'
import RoomList from '../views/RoomList.vue'
import ChatBoard from '../views/ChatBoard.vue'
import Login from '../views/Login.vue'
import SignUp from '../views/SignUp.vue'
// import firebase from "../firebase/firebase"


Vue.use(VueRouter)

const routes = [
  // {
  //   path: '/',
  //   name: 'home',
  //   component: HomeView
  // },
  // {
  //   path: '/',
  //   name: 'UserList',
  //   component: UserList,
  //   //ログインしているか認証し、していなければログインページにリダイレクト 下記methodに処理を書く
  //   meta: {requiresAuth: true }
  // },
  {
    path: '/',
    name: 'RoomList',
    component: RoomList,
    //ログインしているか認証し、していなければログインページにリダイレクト 下記methodに処理を書く
    meta: {requiresAuth: true }
  },
  {
    path: '/chat',
    name: 'ChatBoard',
    component: ChatBoard
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUp
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

//beforeEach ページを開く毎に認証が必要かどうか判断する
router.beforeEach((to, from, next) => {
  //record ...routesのpathなどの情報
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  //requiresAuthがtrueだった場合実行する
  if (requiresAuth) {
    // セッションによってログイン認証管理するに下記onAuthStateChangedから変更
    const user = sessionStorage.getItem('user')
    console.log(JSON.parse(user))// JSON.parse でJSONからオブジェクトに変換
    if (!user) {
        next({
          path: '/login',
          query: { redirect: to.fullPath }
        })
      } else {
        next()
      }
  } else {
    next() // next() を常に呼び出すようにしてください!
  }
})

    //firebaseのonAuthStateChangedでログインしているかどうかチェックする
    //userが取得できなければ、ログインページにリダイレクトする
//     firebase.auth().onAuthStateChanged((user) => {
//       if (!user) {
//         next({
//           path: '/login',
//           query: { redirect: to.fullPath }
//         })
//       } else {
//         next()
//       }
//     })
//   } else {
//     next() // next() を常に呼び出すようにしてください!
//   }
// })

export default router
