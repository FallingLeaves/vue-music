<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox"
                  @query="onQueryChange"></search-box>
    </div>
    <div class="shortcut-wrapper"
         v-show="!query"
         ref="shortcutWrapper">
      <scroll class="shortcut"
              :data="shortCut"
              ref="shortcut"
              :refreshDelay="refreshDelay">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li v-for="(item, index) in hotKey"
                  :key="index"
                  class="item"
                  @click="addQuery(item.k)">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history"
               v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear"
                    @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-list :searches="searchHistory"
                         @select="addQuery"
                         @delete="deleteSearchHistory"></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <div class="search-result"
         v-show="query"
         ref="searchResult">
      <suggest :query="query"
               @select="saveSearch"
               @listScroll="blurInput"
               ref="suggest"></suggest>
    </div>
    <confirm ref="confirm"
             text="是否清空所有搜索历史"
             confirmBtnText="清空"
             @confirm="clearSearchHistory"></confirm>
    <router-view></router-view>
  </div>
</template>

<script>
import SearchBox from 'base/search-box/search-box'
import Scroll from 'base/scroll/scroll'
import SearchList from 'base/search-list/search-list'
import { getHotKey } from 'api/search'
import { ERR_OK } from 'api/config'
import Suggest from 'components/suggest/suggest'
import { mapGetters, mapActions } from 'vuex'
import { playlistMixin, searchMinx } from 'common/js/mixin'
import Confirm from 'base/confirm/confirm'
export default {
  mixins: [playlistMixin, searchMinx],
  created() {
    this._getHotKey()
  },
  data() {
    return {
      hotKey: [],
      // query: ''
    }
  },
  computed: {
    shortCut() {
      return this.hotKey.concat(this.searchHistory)
    },
    // ...mapGetters(['searchHistory'])
  },
  methods: {
    handlePlayList(playList) {
      const bottom = playList.length > 0 ? '60px' : 0
      this.$refs.shortcutWrapper.style.bottom = bottom
      this.$refs.shortcut.refresh()
      this.$refs.searchResult.style.bottom = bottom
      this.$refs.suggest.refresh()
    },
    // addQuery(quert) {
    //   this.$refs.searchBox.setQuery(quert)
    // },
    // onQueryChange(query) {
    //   this.query = query
    // },
    // saveSearch() {
    //   this.saveSearchHistory(this.query)
    // },
    showConfirm() {
      this.$refs.confirm.show()
    },
    // blurInput() {
    //   this.$refs.searchBox.blur()
    // },
    _getHotKey() {
      getHotKey().then(res => {
        if (res.code === ERR_OK) {
          this.hotKey = res.data.hotkey.slice(0, 10)
        }
      })
    },
    ...mapActions([
      // 'saveSearchHistory',
      // 'deleteSearchHistory',
      'clearSearchHistory'
    ])
  },
  watch: {
    query(newQuery) {
      if(!newQuery) {
        setTimeout(() => {
          this.$refs.shortcut.refresh()
        }, 20)
      }
    }
  },
  components: {
    SearchBox,
    Suggest,
    SearchList,
    Scroll,
    Confirm
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'
@import '~common/stylus/mixin'

.search
  .search-box-wrapper
    margin 20px
  .shortcut-wrapper
    position fixed
    top 178px
    bottom 0
    width 100%
    .shortcut
      height 100%
      overflow hidden
      .hot-key
        margin 0 20px 20px 20px
        .title
          margin-bottom 20px
          font-size $font-size-medium
          color $color-text-l
        .item
          display inline-block
          padding 5px 10px
          margin 0 20px 10px 0
          border-radius 6px
          background $color-highlight-background
          font-size $font-size-medium
          color $color-text-d
      .search-history
        position relative
        margin 0 20px
        .title
          display flex
          align-items center
          height 40px
          font-size $font-size-medium
          color $color-text-l
          .text
            flex 1
          .clear
            extend-click()
            .icon-clear
              font-size $font-size-medium
              color $color-text-d
  .search-result
    position fixed
    width 100%
    top 178px
    bottom 0
</style>
