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
    posts: Post[],
    comments: Comment[],
    notifications: Notification[],


}
type Post={
    id: string,
    userId: string,
    body: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date?,
    image: string?,
    likesIds: string[],
    viewsIds: string[],
    user: User,
    comments: Comment[],
   
}
type Comment={
    id: string,
    userId: string,
    postId: string,
    body: string,
    createdAt: Date,
    updatedAt: Date,
    
}
type Notification={
    id: string,
    userId: string,
    body: string,
    createdAt: Date,
}