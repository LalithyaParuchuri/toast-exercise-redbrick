import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import { fetchLikedFormSubmissions } from "./service/mockServer";

// Number of times to fetch the data even when the server throws error
const MAX_RETRIES = 3;

export default function Content(props) {
  const { refreshList, setRefreshList } = props;
  const [data, setData] = useState(null);
  const [retry, setRetry] = useState({count: 0, error: false});

  async function fetchData(val) {
    data && setData(null);
    try {
      const response = await fetchLikedFormSubmissions();
      if (response.status === 200) {
        const formattedData = response.formSubmissions.map((d) => d.data);
        setData(formattedData);
        retry.error && setRetry({...retry, error: false});
      }
    } catch (e) {
      console.log(e);
      setRetry({...retry, count: val ? 1 : retry.count + 1, error: true});
    }
  }

  useEffect(() => {

    if (retry.count < MAX_RETRIES && retry.error && data === null) {
      fetchData();
    } 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retry]);

  useEffect(() => {
    if ((data === null && !retry.error ) || refreshList) {
      fetchData(true);
      refreshList && setRefreshList(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, refreshList]);

  return (
    <Box sx={{ marginTop: 3 }}>
      <Typography variant="h4">Liked Form Submissions</Typography>
      <div variant="body1" sx={{ fontStyle: "italic", marginTop: 1 }}>
        {data ? (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell>Email</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!data?.length ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No records to display
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.map((row, i) => (
                    <TableRow
                      key={i}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.firstName}
                      </TableCell>
                      <TableCell>{row.lastName}</TableCell>
                      <TableCell>{row.email}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              marginTop: "50px",
            }}
          >
            <CircularProgress />
          </div>
        )}
      </div>
    </Box>
  );
}
