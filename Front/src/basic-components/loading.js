import { CircularProgress, Container } from "@mui/material";
import T from "./text";
import Flex from "./display/flex";

export const Loading = () => {
    return (
        <Container sx={{ p: 2 }}>
            <Flex gap="1rem" direction="column" alignItems="center" justifyContent="center">
                <T>loading</T>
                <CircularProgress />
            </Flex>
        </Container>
    );
};
