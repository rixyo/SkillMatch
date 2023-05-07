type User={
    id: string,
    name: string?,
    email: string,
    password: string,
    customTag: string?,
    createdAt: Date,
    updatedAt: Date,
    bio: string?,
    emailVerified: Date?,
    image: string?,
    coverImage: string?,
    profileImage: string?,
    hashedPassword: string,
    isVarified: boolean,
    deletedAt: Date?,
    followingId: string[],
    followerId: string[],
    hasNotifications: boolean,
    isActived: boolean,
    posts: Post[],
    comments: Comment[],
    notifications: Notification[],
    replays: Replay[],
    nestedReplays: NestedReplay[],
    skills: string[]
    skills: Skill[],
    projects: Project[],


}
type Post={
    id: string,
    userId: string,
    body: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date?,
    image: string?,
    likesId: string[],
    viewsId: string[],
    user: User,
    comments: comment[],
    isShared: boolean,
    fromSharedId: string?,
    postSharedCreatedAt: Date?,
   
}
type comment={
    id: string,
    userId: string,
    postId: string,
    body: string,
    likesId: string[],
    createdAt: Date,
    updatedAt: Date,
    replays: Replay[],
    
}
type Replay={
    id: string,
    userId: string,
    postId: string,
    commentId: string,
    body: string,
    likesId: string[],
    createdAt: Date,
    updatedAt: Date,
    nestedReplays: NestedReplay[],
}
type NestedReplay={
    id: string,
    userId: string,
    replayId: string,
    body: string,
    likesId: string[],
    createdAt: Date,
    updatedAt: Date,

}
type notification={
    id: string,
    userId: string,
    body: string,
    createdAt: Date,
    type: string,
    link: string,
   isRead: boolean,
   fromId   : string,
}

type Project={
    id: string,
    name: string,
    description: string,
    createdAt: Date,
    startDate: Date?,
    endDate: Date?,
    link: string,
    userId: string,
}
type Skill={
    id: string,
    name: string,
   userId: string,

}