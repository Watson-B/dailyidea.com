<template>
  <users-profile
    v-slot="{ handleViewPreview }"
    :initial-profile-data="userInfo"
    :ideas="userIdeas"
    :load-more-ideas-is-possible="loadMoreIdeasIsPossible"
  >
    <div v-if="userIdeas.length > 0" class="cards-container">
      <full-idea
        v-for="(idea, index) in userIdeas"
        :key="index"
        class="my-8"
        preview
        allow-mobile-scroll
        :idea="idea"
        @view-preview="handleViewPreview(idea)"
      ></full-idea>
    </div>
    <div v-else class="cards-container">
      <no-ideas-placeholder
        title="You haven't posted an idea yet."
        body="Browse ideas to get inspiration!"
      ></no-ideas-placeholder>
    </div>
  </users-profile>
</template>

<script>
import userInfoBySlug from '@/graphql/query/userInfoBySlug'
import UsersProfile from '@/components/profilePage/UsersProfile'
import FullIdea from '@/components/ideaDetail/FullIdea'
import NoIdeasPlaceholder from '@/components/ideaDetail/NoIdeasPlaceholder'

import getUsersIdeas from '@/graphql/query/getUsersIdeas'
import loadIdeas from '@/components/ideasList/loadIdeas'
import getIdeas from '@/graphql/query/getIdeas'

export default {
  name: 'UserSlugVue',
  components: { UsersProfile, FullIdea, NoIdeasPlaceholder },
  async asyncData({ app, route, store, error }) {
    const userSlug = route.params.userSlug
    const isMyProfile = store.getters['userData/slug'] === route.params.userSlug
    const userInfoRequest = await app.$amplifyApi.graphql({
      query: userInfoBySlug,
      variables: { slug: userSlug },
      authMode: isMyProfile ? undefined : 'API_KEY'
    })
    const userIdeasRequest = loadIdeas(
      app.$amplifyApi,
      isMyProfile ? 'ideas' : 'getUsersIdeas',
      isMyProfile ? getIdeas : getUsersIdeas,
      isMyProfile ? { limit: 25 } : { authorSlug: userSlug, limit: 25 },
      isMyProfile ? undefined : 'API_KEY'
    )
    const [userInfoResponse, userIdeasResponse] = await Promise.all([
      userInfoRequest,
      userIdeasRequest
    ])
    const userInfo = userInfoResponse.data.userInfoBySlug.userInfo
    if (!userInfo) {
      error({ statusCode: 404, message: 'User not found' })
    }
    const userIdeas = userIdeasResponse.ideas
    const loadMoreIdeasIsPossible = !!userIdeasResponse.nextToken
    return {
      userInfo,
      userIdeas,
      loadMoreIdeasIsPossible
    }
  },

  head() {
    return {
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: `See ${this.userInfo.name}'s ideas on Daily Idea`
        }
      ]
    }
  }
}
</script>

<style scoped lang="scss">
.cards-container {
  margin: 0 auto;
  @media (min-width: $screen-md-min) {
    width: 650px;
  }
}
</style>