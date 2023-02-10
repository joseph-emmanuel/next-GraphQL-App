import { ApolloServer } from "apollo-server-micro";

import "reflect-metadata";
import { buildSchema, Resolver, Query,Arg, Field, ObjectType,ID } from "type-graphql";

@ObjectType()
export class Dog {
    @Field(type => ID)
    name: string;
}

@Resolver(Dog)
export class DogResolver {
    @Query(() => [Dog])
    dogs(): Dog[] {
        return [
            { name: "Snickers" },
            { name: "Sunny" },
            { name: "Bubba" },
        ];
    }
}

const schema = await buildSchema({
    resolvers: [DogResolver],
});


const apolloServer = new ApolloServer({
    schema,
});

export const config = {
    api: {
        bodyParser: false,
    },
};

const startServer = apolloServer.start();

export default async function handler(req, res) {
    await startServer;
    await apolloServer.createHandler({
        path: "/api/graphql",
    })(req, res);
}