import {useEffect, useLayoutEffect, useState} from 'react';
import {api} from "./api";
import {accessTokenAtom} from "./store";
import {unsafe_updater} from "@mntm/precoil";
import {UserType} from "./types";

export type screenType = 'desktop' | 'mobile';

export function useScreenType(): screenType {
  const [screenType, setScreenType] = useState<screenType>('desktop');
  useLayoutEffect(() => {
    function updateType() {
      if (window.innerWidth >= 768) {
        setScreenType('desktop')
      } else {
        setScreenType('mobile')
      }
    }
    window.addEventListener('resize', updateType);
    updateType();
    return () => window.removeEventListener('resize', updateType);
  }, []);
  return screenType;
}

export function useUserType(): UserType {
  const [userType, setUserType] = useState<UserType>(updateType())

  function updateType() {
    const token = api.getToken();
    if (token.payload.exp * 1000 >= (new Date().getTime())) {
      return token.payload.Role || 'not_authorized'
    } else {
      return 'not_authorized'
    }
  }

  useEffect(() => {
    function emitUpdate() {
      setUserType(updateType());
    }

    unsafe_updater.on(accessTokenAtom.key, () => {
      emitUpdate()
    })
    updateType();
    return () => {
      unsafe_updater.on(accessTokenAtom.key, () => {})
    }
  }, [])
  return userType;
}