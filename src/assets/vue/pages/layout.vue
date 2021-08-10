<template>
  <f7-page :page-content="false">
    <div class="toolbar tabbar toolbar-bottom">
      <bottom-tabs />
    </div>
    <f7-tabs>
      <f7-tab id="tab-1" class="page-content" tab-active>
        <MainPage />
      </f7-tab>
      <f7-tab id="tab-2" class="page-content">
        <Menu />
      </f7-tab>
      <f7-tab id="tab-3" class="page-content">
        <Discount />
      </f7-tab>
      <f7-tab id="tab-4" class="page-content">
        <Profile />
      </f7-tab>
    </f7-tabs>
  </f7-page>
</template>

<script>
//Pages
import MainPage from './main'
import Discount from './discount'
import Menu from './menu'
import Profile from './profile'

//components
import AppBar from '../components/appbar'
import BottomTabs from '../components/bottomtabs'
import Accordion from '../components/accordion'

export default {
  components: {
    MainPage,
    AppBar,
    BottomTabs,
    Discount,
    Menu,
    Accordion,
    Profile
  }
}
</script>
