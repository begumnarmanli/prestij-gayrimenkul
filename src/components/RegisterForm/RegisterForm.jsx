import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore/lite";
import { auth, db } from "../../firebase";
import { setCredentials } from "../../redux/auth/authSlice";
import CheckIcon from "../../assets/icons/check.svg?react";
import CloseIcon from "../../assets/icons/close.svg?react";
import EyeOpenIcon from "../../assets/icons/eye-open.svg?react";
import EyeClosedIcon from "../../assets/icons/eye-closed.svg?react";
import styles from "./RegisterForm.module.css";

const schema = yup.object({
  name: yup.string().required("Ad zorunludur"),
  email: yup
    .string()
    .matches(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, "Geçersiz e-posta")
    .required("E-posta zorunludur"),
  password: yup
    .string()
    .min(7, "Şifre en az 7 karakter olmalıdır")
    .matches(/[A-Z]/, "En az bir büyük harf içermelidir")
    .matches(/[a-z]/, "En az bir küçük harf içermelidir")
    .matches(/[0-9]/, "En az bir rakam içermelidir")
    .matches(/[!@#$%^&*(),.?":{}|<>]/, "En az bir özel karakter içermelidir")
    .required("Şifre zorunludur"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Şifreler eşleşmiyor")
    .required("Şifre tekrarı zorunludur"),
});

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const nameValue = useWatch({ control, name: "name" });
  const emailValue = useWatch({ control, name: "email" });
  const passwordValue = useWatch({ control, name: "password" });
  const confirmPasswordValue = useWatch({ control, name: "confirmPassword" });

  const onSubmit = async (data) => {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      );
      const firebaseUser = result.user;
      const token = await firebaseUser.getIdToken();

      await setDoc(doc(db, "users", firebaseUser.uid), {
        name: data.name,
        email: data.email,
        phone: "",
        avatar: "",
        favorites: [],
        createdAt: new Date(),
      });

      dispatch(
        setCredentials({
          user: {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: data.name,
            phone: "",
            avatar: "",
            favorites: [],
          },
          token,
        }),
      );

      navigate("/profile");
    } catch {
      // kayıt başarısız
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.field}>
        <div className={styles.inputWrap}>
          <input
            className={`${styles.input} ${errors.name ? styles.inputError : nameValue ? styles.inputSuccess : ""}`}
            type="text"
            placeholder="Ad Soyad"
            {...register("name")}
          />
          {nameValue && !errors.name && (
            <CheckIcon className={styles.iconSuccess} />
          )}
          {nameValue && errors.name && (
            <CloseIcon className={styles.iconError} />
          )}
        </div>
        {errors.name && (
          <span className={styles.errorMsg}>{errors.name.message}</span>
        )}
      </div>

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

      <div className={styles.field}>
        <div className={styles.inputWrap}>
          <input
            className={`${styles.input} ${errors.confirmPassword ? styles.inputError : confirmPasswordValue ? styles.inputSuccess : ""}`}
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Şifre Tekrarı"
            {...register("confirmPassword")}
          />
          {confirmPasswordValue && !errors.confirmPassword && (
            <CheckIcon
              className={`${styles.iconSuccess} ${styles.iconBeforeEye}`}
            />
          )}
          <button
            type="button"
            className={styles.eyeBtn}
            onClick={() => setShowConfirmPassword((prev) => !prev)}
          >
            {showConfirmPassword ? (
              <EyeOpenIcon className={styles.eyeIcon} />
            ) : (
              <EyeClosedIcon className={styles.eyeIcon} />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <span className={styles.errorMsg}>
            {errors.confirmPassword.message}
          </span>
        )}
      </div>

      <button className={styles.btn} type="submit">
        Kayıt Olun
      </button>
    </form>
  );
}
