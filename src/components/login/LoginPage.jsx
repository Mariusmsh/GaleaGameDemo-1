import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  Button,
  Container,
  Grid,
  IconButton,
  makeStyles,
  Paper,
  TextField,
  Tooltip,
  Typography,
  createMuiTheme,
  ThemeProvider
} from "@material-ui/core";


import FacebookIcon from "@material-ui/icons/Facebook";
import MailIcon from "@material-ui/icons/Mail";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { useHistory } from "react-router";
import {
  signInWithEmail,
  socialLogin,
} from "../../App/firestore/firebaseService";
import Alert from "@material-ui/lab/Alert";
import ResetPassword from "./ResetPassword";

const useStyles = makeStyles((theme) => ({
  paper: {
    width: theme.spacing(55),
    padding: theme.spacing(3),
    textAlign: "center",
  },
  button: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  textField: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));


  //const that defines the theme 
  const blueTheme = createMuiTheme({
    palette: {
      primary:  {
        main: '#3f51b5',
      }
    }

  });

  //const that defines the theme 
  const redTheme = createMuiTheme({
    palette: {
      primary:  {
        main: '#e90101',
      }
    }

  });



const validationSchema = yup.object({
  email: yup
    .string("Enter your email")
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup
    .string("Enter your password")
    .min(8, "Password should be minimum of 8 characters")
    .required("Password is required"),
});

export default function LoginPage() {
  const classes = useStyles();
  const history = useHistory();
  const [btnBack, setBtnBack] = React.useState(false);
  const [resetPassword, setResetPassword] = React.useState(false);

  function handleSocialLogin(provider) {
    socialLogin(provider);
    history.push("/");
  }

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting, setErrors, resetForm }) => {
      try {
        await signInWithEmail(values);
        resetForm({ values: "" });
        setSubmitting(false);
        history.push("/");
      } catch (error) {
        setErrors({ auth: "Problem, with email or password" });
        setSubmitting(false);
      }
    },
  });

  function renderEmailLoginForm() {
    return (
      <Paper elevation={3} className={classes.paper}>
        <Grid container direction="column">
          <Grid
            item
            container
            direction="column"
            justify="flex-end"
            alignItems="flex-end"
          >
            <Tooltip title="Go Back">
              <IconButton
                aria-label="go-back"
                onClick={() => setBtnBack(false)}
              >
                <ArrowBackIosIcon />
              </IconButton>
            </Tooltip>
          </Grid>

          <Grid
            item
            container
            direction="column"
            justify="center"
            alignItems="center"
          >
            {!resetPassword ? (
              <form onSubmit={formik.handleSubmit}>
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="Email"
                  className={classes.textField}
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />

                <TextField
                  fullWidth
                  id="password"
                  name="password"
                  label="Password"
                  type="password"
                  className={classes.textField}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  helperText={formik.touched.password && formik.errors.password}
                />

                {formik.errors.auth && (
                  <Alert severity="error">{formik.errors.auth}</Alert>
                )}

                <Button
                  color="inherit"
                  variant="contained"
                  fullWidth
                  type="submit"
                  className={classes.button}
                >
                  Submit
                </Button>
                <ThemeProvider theme={redTheme}>
                <Button
                  color="primary"
                  onClick={() => setResetPassword(true)}
                >
                  Forgot password? Click Here
                </Button> 
                </ThemeProvider>
              </form>
            ) : (
              <ResetPassword setResetPassword={setResetPassword} />
            )}
          </Grid>

          <Grid
            item
            container
            direction="column"
            justify="center"
            alignItems="center"
          >
            <Typography component="h4" variant="h6">
              OR
            </Typography>
          </Grid>

          <Grid
            item
            container
            direction="column"
            justify="center"
            alignItems="center"
          >
            <ThemeProvider theme = {redTheme}>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              fullWidth={true}
              onClick={() => handleSocialLogin("google")}
            >
              Login with Google
            </Button>
            </ThemeProvider>
          </Grid>
        </Grid>
      </Paper>
    );
  }

  return (
    <Container maxWidth="sm">
      <Grid container direction="column" justify="center" alignItems="center">
        {!btnBack ? (
          <Paper elevation={3} className={classes.paper}>
            <ThemeProvider theme = {blueTheme}>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              startIcon={<FacebookIcon />}
              fullWidth={true}
              onClick={() => handleSocialLogin("facebook")}
            >
              Login with Facebook
            </Button>
            </ThemeProvider>
            <Typography component="h4" variant="h6">
              OR
            </Typography>
            <Button
              variant="contained"
              color="inherit"
              className={classes.button}
              startIcon={<MailIcon />}
              fullWidth={true}
              onClick={() => setBtnBack(true)}
            >
              Login with Email
            </Button>
          </Paper>
        ) : (
          renderEmailLoginForm()
        )}
      </Grid>
    </Container>
  );
}
