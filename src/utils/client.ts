import {createTRPCClient, httpBatchLink} from '@trpc/client'
import type {AppRouter} from '../server/routes/router'

const trpc = createTRPCClient<AppRouter>({
    links: [
        httpBatchLink({
            url: 'http://localhost:8080/',
        })
    ]
})

const users = await trpc.userList.query();