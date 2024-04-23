import React, {useState} from "react";
import './style.scss'
import {Button, Checkbox, FormItem, Group, Input, ScreenSpinner} from "@vkontakte/vkui";
import {CommonPanelHeader, ProtectedPanel, ProtectedPanelProps} from "../../components";
import {useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {api} from "../../api";

export const AdminCreatePanel: React.FC<ProtectedPanelProps> = ({
  nav,
  redirectTo
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [sudo, setSudo] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const router = useRouteNavigator();

  const createClient = () => {
    if (firstName && lastName && login && password) {
      router.showPopout(
        <ScreenSpinner/>
      )
      api.createAdmin(firstName, lastName, login, password, sudo).then(data => {

      }).catch(() => {

      }).finally(() => {
        router.hidePopout();
        router.back();
      })
    } else {
      setShowErrors(true);
    }
  }

  return (
    <ProtectedPanel nav={nav} redirectTo={redirectTo}>
      <CommonPanelHeader>
        Новый администратор
      </CommonPanelHeader>

      <Group>
        <form onSubmit={e => e.preventDefault()}>
          <FormItem top={'Имя администратора'}>
            <Input
              status={(showErrors && !firstName) ? 'error' : 'default'}
              placeholder={'Введите имя'}
              value={firstName}
              onChange={e => {
                setFirstName(e.target.value);
                setShowErrors(false);
              }}
            />
          </FormItem>
          <FormItem top={'Фамилия администратора'}>
            <Input
              status={(showErrors && !lastName) ? 'error' : 'default'}
              placeholder={'Введите фамилию'}
              value={lastName}
              onChange={e => {
                setLastName(e.target.value);
                setShowErrors(false);
              }}
            />
          </FormItem>
          <FormItem top={'Логин администратора'}>
            <Input
              status={(showErrors && !login) ? 'error' : 'default'}
              placeholder={'Введите логин'}
              value={login}
              onChange={e => {
                setLogin(e.target.value);
                setShowErrors(false);
              }}
            />
          </FormItem>
          <FormItem top={'Пароль администратора'}>
            <Input
              status={(showErrors && !password) ? 'error' : 'default'}
              placeholder={'Введите пароль'}
              value={password}
              onChange={e => {
                setPassword(e.target.value);
                setShowErrors(false);
              }}
            />
          </FormItem>
          <FormItem>
            <Checkbox
              checked={sudo}
              onChange={e => {
                setSudo(e.target.checked);
              }}
            >
              Суперадмин
            </Checkbox>
          </FormItem>
          <FormItem>
            <Button onClick={createClient} stretched size={'m'}>
              Сохранить
            </Button>
          </FormItem>
        </form>
      </Group>
    </ProtectedPanel>
  )
}