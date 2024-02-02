<template>
    <v-app id="inspire">
      <Sidebar />
      <v-app-bar app shrink-on-scroll>
        <!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->
  
        <v-app-bar-title>ユーザー一覧</v-app-bar-title>
  
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
              v-for="n in 24"
              :key="n"
              cols="4"
            >
              <!-- <v-card height="200"></v-card> -->
                <router-link :to="{ path:'/chat', query: {user_id: n}}">
                <v-avatar
                    color="grey lighten-2"
                    size="128"
                    ></v-avatar>
                </router-link>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </v-app>
  </template>

<script>
import Sidebar from '../components/layouts/Sidebar'

export default {
  components: {
    Sidebar
  },
}
</script>