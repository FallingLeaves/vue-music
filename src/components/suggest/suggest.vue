<template>
  <scroll class="suggest"
          :data="result"
          :pullup="pullup"
          :beforeScroll="beforeScroll"
          @scrollToEnd="searchMore"
          @beforeScroll="listScroll"
          ref="suggest">
    <ul class="suggest-list">
      <li class="suggest-item"
          v-for="(item, index) in result"
          :key="index"
          @click="selectItem(item)">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text"
             v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore"
               title=""></loading>
    </ul>
    <div v-show="!hasMore && !result.length" class="no-result-wrapper">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script>
import { search } from 'api/search'
import { ERR_OK } from 'api/config'
// import { filterSinger } from 'common/js/song'
import { getSingerDetail, getSongVkey } from 'api/singer'
import { createSong } from 'common/js/song'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import NoResult from 'base/no-result/no-result'
import Singer from 'common/js/singer'
import { mapMutations, mapActions } from 'vuex'
const TYPE_SINGER = 'singer'
const perpage = 30
export default {
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      page: 1,
      result: [],
      pullup: true,
      beforeScroll: true,
      hasMore: true
    }
  },
  methods: {
    search() {
      this.hasMore = true
      search(this.query, this.page, this.showSinger, perpage).then(async res => {
        if (res.code === ERR_OK) {
          let result = await this._genResult(res.data)
          this.result = result
          this._checkMore(res.data)
        }
      })
    },
    searchMore() {
      if (!this.hasMore) {
        return
      }
      this.page++
      search(this.query, this.page, this.showSinger, perpage).then(async res => {
        if (res.code === ERR_OK) {
          let result = await this._genResult(res.data)
          this.result = this.result.concat(result)
          this._checkMore(res.data)
        }
      })
    },
    getIconCls(item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    getDisplayName(item) {
      if (item.type === TYPE_SINGER) {
        return item.singername
      } else {
        return `${item.name}-${item.singer}`
      }
    },
    selectItem(item) {
      if (item.type === TYPE_SINGER) {
        const singer = new Singer({
          id: item.singermid,
          name: item.singername
        })
        this.$router.push({
          path: `/search/${singer.id}`
        })
        this.setSinger(singer)
      } else {
        this.insertSong(item)
      }
      this.$emit('select')
    },
    refresh() {
      this.$refs.suggest.refresh()
    },
    listScroll() {
      this.$emit('listScroll')
    },
    _checkMore(data) {
      const song = data.song
      if (
        !song.list.length ||
        song.curnum + (song.curpage) * perpage > song.totalnum
      ) {
        this.hasMore = false
      }
    },
    async _genResult(data) {
      let ret = []
      if (data.zhida && data.zhida.singerid) {
        ret.push({ ...data.zhida, ...{ type: TYPE_SINGER } })
      }
      if (data.song) {
        let result = await this._normalizeSongs(data.song.list)
        // console.log(result)
        ret = ret.concat(result)
      }
      return new Promise((resolve, reject) => {
        resolve(ret)
      })
    },
    _getSongVkey(songmid) {
      return getSongVkey(songmid).then(res => {
        return res
      })
    },
    async _normalizeSongs(list) {
      let ret = []
      let res = []
      list.forEach(musicData => {
        res.push(this._getSongVkey(musicData.songmid))
      })
      let result = await Promise.all(res)
      result.forEach((res, index) => {
        const vkey = res.data.items[0].vkey
        let musicData = list[index]
        if (musicData.songid && musicData.albummid && vkey) {
          ret.push(createSong(musicData, vkey))
        }
      })
      return new Promise((resolve, reject) => {
        resolve(ret)
      })
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions([
      'insertSong'
    ])
  },
  watch: {
    query() {
      this.search()
    }
  },
  components: {
    Scroll,
    Loading,
    NoResult
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'
@import '~common/stylus/mixin'

.suggest
  height 100%
  overflow hidden
  .suggest-list
    padding 0 30px
    .suggest-item
      display flex
      align-items center
      padding-bottom 20px
    .icon
      flex 0 0 30px
      width 30px
      [class^='icon-']
        font-size 14px
        color $color-text-d
    .name
      flex 1
      font-size $font-size-medium
      color $color-text-d
      overflow hidden
      .text
        no-wrap()
  .no-result-wrapper
    position absolute
    width 100%
    top 50%
    transform translateY(-50%)
</style>
