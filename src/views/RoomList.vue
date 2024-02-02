<template>
    <v-app id="inspire">
      <Sidebar />
      <v-app-bar app shrink-on-scroll>
        <!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->
  
        <v-app-bar-title>ルーム一覧</v-app-bar-title>
        <CreateRoom />
        <v-spacer></v-spacer>
  
        <!-- <v-btn icon="mdi-dots-vertical">
        </v-btn> -->
        <v-btn icon>
            <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </v-app-bar>

      <v-main>
        <v-container>
          <v-row>
            <v-col
              v-for="room in rooms"
              :key="room.id"
              cols="4"
            >
                <router-link :to="{ path:'/chat', query: {room_id: room.id}}">
                <v-avatar
                    color="grey lighten-2"
                    size="128"
                    >
                    <img
                        src="https://cdn.vuetifyjs.com/images/john.jpg"
                        alt="John"
                        v-if="!room.thumbnailUrl"
                    >
                    <img
                        :src="room.thumbnailUrl"
                        alt="John"
                        v-if="room.thumbnailUrl"
                    >
                </v-avatar>
                </router-link>
            </v-col>
            <!-- <v-col
              v-for="n in 24"
              :key="n"
              cols="4"
            >
                <router-link :to="{ path:'/chat', query: {user_id: n}}">
                <v-avatar
                    color="grey lighten-2"
                    size="128"
                    ></v-avatar>
                </router-link>
            </v-col> -->
          </v-row>
        </v-container>
      </v-main>
    </v-app>
  </template>

<script>
import Sidebar from '../components/layouts/Sidebar'
import CreateRoom from '../components/modal/CreateRoom'
import firebase from "../firebase/firebase"

export default {
  components: {
    Sidebar,
    CreateRoom
  },
  data: () => ({
    rooms: [],
  }),
  //描画されたタイミングでgetRoomsが動くように処理を実行
  mounted() {
    this.getRooms()
  },
  methods: {
    async getRooms() {
        this.rooms = []
        const roomRef = firebase.firestore().collection("rooms")
        const snapshot = await roomRef.get()
        console.log("snapshot",snapshot)
        //ファイアストアに保存しているデータをループで取得する
        //jsでは、mapを使用する場合が多いがsnapshotにはmapが存在しない
        snapshot.forEach(doc => {
            console.log(doc.data())
            const data = {
                name: doc.data().name,
                thumbnailUrl: doc.data().thumbnailUrl,
                createdAt: doc.data().createdAt
            }
            //上記の省略形スプリット構文
            // const data = {...doc.data()}

            data.id = doc.id
            console.log(data)
            this.rooms.push(data)
        })

        //snapshotはオブジェクトなのに対し、mapは配列(ドキュメント)のループ処理しか行えない
        //docsを使用し配列として受け取れば使える
    //     snapshot.docs.map(doc => {
    //         console.log(doc.data())
    //         this.rooms.push(doc.data())
    //     })
    // }
  }
}}
</script>