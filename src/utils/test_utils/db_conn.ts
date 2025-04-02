import { Provider } from "@nestjs/common";
import { MySqlContainer, StartedMySqlContainer } from "@testcontainers/mysql"
import { DATA_SOURCE } from "../../entity_provider/constant";
import { DataSource } from "typeorm";
import { ArtistProfile } from "../../entities/artist_profile.entity";
import { EventListingEntry } from "../../entities/event_listing_entry.entity";
import { BookingTransaction } from "../../entities/booking_transaction.entity";

export const getDbContainer = async () => {
let container: StartedMySqlContainer
     container = await new MySqlContainer().withDatabase("test").withUserPassword("test").withUsername("test").start();
    return container
}

export const GetDatabaseSourceProvider = (container: StartedMySqlContainer) => ({
    provide: DATA_SOURCE,
    useFactory: async () => {
        // const db_container = await getDbContainer()
        const host = container.getHost()
        const port = container.getPort()
        const username = container.getUsername()
        const password = container.getUserPassword()
        const db_name = container.getDatabase()
        const dataSource = new DataSource({
            type: "mysql",
            host,
            port,
            username,
            password,
            database: db_name,
            entities: [ArtistProfile,EventListingEntry,BookingTransaction
            ],
            synchronize: true,
        });

        return dataSource.initialize();
    },
})

export const teardownMySqlContainer = async (container: StartedMySqlContainer) => {
    await container.stop();
}