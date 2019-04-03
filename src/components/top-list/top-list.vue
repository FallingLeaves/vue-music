<template>
  <transition name="slide">
    <music-list :title="title"
                :bg-image="bgImage"
                :songs="songs"
                :rank="rank"></music-list>
  </transition>
</template>

<script>
import MusicList from 'components/music-list/music-list'
import { mapGetters } from 'vuex'
import { getMusicList } from 'api/rank'
import { ERR_OK } from 'api/config'
import { createSong } from 'common/js/song'
import { getSongVkey } from 'api/singer'
export default {
  computed: {
    title() {
      return this.topList.topTitle
    },
    bgImage() {
      if (this.songs.length) {
        return this.songs[0].image
      }
      return ''
    },
    ...mapGetters(['topList'])
  },
  created() {
    this._getMusicList()
  },
  data() {
    return {
      songs: [],
      rank: true
    }
  },
  methods: {
    _getMusicList() {
      if (!this.topList.id) {
        this.$router.push('/rank')
        return
      }
      getMusicList(this.topList.id).then(res => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.songlist)
        }
      })
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach(item => {
        let musicData = item.data
        if (musicData.songid && musicData.albumid) {
          getSongVkey(musicData.songmid).then(res => {
            // console.log('这首歌的vkey获取到了')
            const vkey = res.data.items[0].vkey
            if (musicData.songid && musicData.albummid && vkey) {
              ret.push(createSong(musicData, vkey))
            }
          })
        }
      })
      return ret
    }
  },
  components: {
    MusicList
  }
}
</script>

<style lang="stylus" scoped>
.slide-enter-active, .slide-leave-active
  transition all 0.3s ease
.slide-enter, .slide-leave-to
  transform translate3d(100%, 0, 0)
</style>
