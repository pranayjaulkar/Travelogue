import { makeStyles } from "@mui/styles";

export default makeStyles((theme) => ({
  paper: {
    display: "flex",
    marginBottom: "1rem",
    width: "100%",
    justifyContent: "center",
    boxSizing: "border-box",
    boxShadow: "var(--shadow)",
  },
  root: {
    "& .MuiTextField-root": {
      marginBottom: "1rem",
      width: "100%",
    },
  },
  form: {
    display: "flex",
    flexGrow: "1",
    padding: "1rem",
    width: "100%",
    flexDirection: "column",
    justifyContent: "center",
    boxSizing: "border-box",
    alignItems: "center",
    // "& *": {
    //   fontFamily: "'Quicksand', sans-serif",
    //   "& label": {
    //     fontFamily: "'Quicksand', sans-serif",
    //   },
    // },
    "& button:nth-of-type(1)": {
      backgroundColor: "dodgerblue",
    },
  },

  chipInput: {
    width: "100%",
  },
  fileInput: {
    width: "100%",
    marginBottom: "1rem",
  },
  buttonSubmit: {
    paddingLeft: "0",
    paddingRight: "0",
    marginBottom: "1rem",
  },
}));
