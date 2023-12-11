import { Grid, TextField, InputAdornment, IconButton } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function Input({
  name,
  half,
  handleChange,
  label,
  type,
  autoFocus,
  handleShowPassword,
  error,
}) {
  return (
    <Grid item xs={12} sm={half ? 6 : 12} sx={{ padding: ".5rem" }}>
      <TextField
        name={name}
        onChange={handleChange}
        variant="outlined"
        fullWidth
        error={error.error}
        helperText={error.helperText}
        label={label}
        autoFocus={autoFocus}
        type={type}
        InputProps={
          name === "password" || name === "confirmPassword"
            ? {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleShowPassword}>
                      {type === "password" ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }
            : {}
        }
      />
    </Grid>
  );
}
