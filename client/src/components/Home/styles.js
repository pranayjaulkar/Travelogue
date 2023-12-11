import { makeStyles } from "@mui/styles";

export default makeStyles((theme) => ({
  container: {
    padding: "0px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "0px",
    maxWidth: "100%",
  },
  appBarSearch: {
    borderRadius: 4,
    marginBottom: "1rem",
    display: "flex",
    padding: "1rem",
    zIndex: "2",
    boxShadow: "var(--shadow)",
    "& .MuiTextField-root": {
      marginBottom: "1rem",
    },
    // "& div": {
    //   "& .MuiInputLabel-outlined": {
    //     fontFamily: "'Quicksand', sans-serif",
    //   },
    //   "& div": {
    //     "& input": {
    //       fontFamily: "'Quicksand', sans-serif",
    //     },
    //   },
    // },
    "& button": {
      backgroundColor: "dodgerblue",
      // fontFamily: "'Quicksand', sans-serif",
    },
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  gridContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    width: "100%",
    margin: "1.5rem",
    padding: "0",
    [theme.breakpoints.down("md")]: {
      margin: "1rem",
      padding: "0",
    },
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column-reverse",
      justifyContent: "center",
      alignItems: "center",
      margin: "0.5rem",
      padding: "0",
    },
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column-reverse",
    },
  },
  secondGridContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: "12px",
  },
  paper: {
    padding: "1rem",
    marginBottom: "1rem",
    border: "0",
    backgroundColor: "rgba(0,0,0,0)",
  },
}));
