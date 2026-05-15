import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { setCredentials } from "../../redux/auth/authSlice";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CheckIcon from "../../assets/icons/check.svg?react";
import CloseIcon from "../../assets/icons/close.svg?react";
import EyeOpenIcon from "../../assets/icons/eye-open.svg?react";
import EyeClosedIcon from "../../assets/icons/eye-closed.svg?react";
import styles from "./LoginForm.module.css";

const schema = yup.object({
  email: yup
    .string()
    .matches(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, "Geçersiz e-posta")
    .required("E-posta zorunludur"),
  password: yup
    .string()
    .min(7, "Şifre en az 7 karakter olmalıdır.")
    .required("Şifre zorunludur"),
});

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const emailValue = useWatch({ control, name: "email" });
  const passwordValue = useWatch({ control, name: "password" });

  const onSubmit = async (data) => {
    try {
      const result = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      );
      const firebaseUser = result.user;
      const token = await firebaseUser.getIdToken();

      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
      const userData = userDoc.exists() ? userDoc.data() : {};

      dispatch(
        setCredentials({
          user: {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: userData.name || "",
            phone: userData.phone || "",
            avatar: userData.avatar || "",
            favorites: userData.favorites || [],
          },
          token,
        }),
      );

      navigate("/listings");
    } catch {
      // giriş başarısız
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.field}>
        <div className={styles.inputWrap}>
          <input
            className={`${styles.input} ${errors.email ? styles.inputError : emailValue ? styles.inputSuccess : ""}`}
            type="email"
            placeholder="E-posta"
            {...register("email")}
          />
          {emailValue && !errors.email && (
            <CheckIcon className={styles.iconSuccess} />
          )}
          {emailValue && errors.email && (
            <CloseIcon className={styles.iconError} />
          )}
        </div>
        {errors.email && (
          <span className={styles.errorMsg}>{errors.email.message}</span>
        )}
      </div>

      <div className={styles.field}>
        <div className={styles.inputWrap}>
          <input
            className={`${styles.input} ${errors.password ? styles.inputError : passwordValue ? styles.inputSuccess : ""}`}
            type={showPassword ? "text" : "password"}
            placeholder="Şifre"
            {...register("password")}
          />
          {passwordValue && !errors.password && (
            <CheckIcon
              className={`${styles.iconSuccess} ${styles.iconBeforeEye}`}
            />
          )}
          <button
            type="button"
            className={styles.eyeBtn}
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? (
              <EyeOpenIcon className={styles.eyeIcon} />
            ) : (
              <EyeClosedIcon className={styles.eyeIcon} />
            )}
          </button>
        </div>
        {errors.password && (
          <span className={styles.errorMsg}>{errors.password.message}</span>
        )}
      </div>

      <button className={styles.btn} type="submit">
        Giriş Yapın
      </button>
    </form>
  );
}
