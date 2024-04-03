import React, {useState} from "react";
import {
  Alert,
  Button, Card,
  Div,
  FormItem,
  FormStatus,
  Input,
  Panel,
  PanelProps,
  ScreenSpinner,
  Title
} from "@vkontakte/vkui";
import './style.scss';
import {Icon16KeyOutline, Icon16LockOutline, Icon16UserOutline} from "@vkontakte/icons";
import {useSetAtomState} from "@mntm/precoil";
import {popoutAtom} from "../../store";
import {api} from "../../api";
import {useRouteNavigator} from "@vkontakte/vk-mini-apps-router";

export const LoginPanel: React.FC<PanelProps> = ({
  nav
}) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [selectedAccountType, setSelectedAccountType] = useState<'admin' | 'trainer'>('trainer')
  const [showFormErrors, setShowFormErrors] = useState(false);
  const setPopout = useSetAtomState(popoutAtom);
  const router = useRouteNavigator();

  const onFormSubmit = () => {
    if (selectedAccountType === "admin") {
      if (!login || !password) {
        setShowFormErrors(true);
        return;
      }
      setPopout(<ScreenSpinner/>)
      api.authAdmin(login, password).then(data => {
        setPopout(undefined);
        router.replace('/');
      }).catch(() => showLoginErrorAlert('Неправильный логин или пароль'));

    } else {
      if (!login) {
        setShowFormErrors(true);
        return;
      }
      setPopout(<ScreenSpinner/>)
      api.authTrainer(login).then(data => {
        setPopout(undefined);
        router.replace('/');
      }).catch(() => showLoginErrorAlert('Неправильный секретный ключ'));
    }
  }

  const showLoginErrorAlert = (text: string) => {
    setPopout(
      <Alert
        header={'Ошибка'}
        text={text}
        onClose={() => setPopout(null)}
        actions={[{title: 'Закрыть', mode: 'cancel'}]}
      />
    )
  }

  const toggleAccountType = () => {
    setSelectedAccountType(selectedAccountType === 'admin' ? 'trainer' : 'admin');
  }

  return (
    <Panel nav={nav}>
      <div className={'LoginRoot'}>
        <Card className={'LoginCard'} mode={'outline'}>
          <Title className={'LoginCard--header'} level={'2'}>
            Вход для {selectedAccountType === 'admin' ? 'администратора' : 'тренера'}
          </Title>

          {selectedAccountType === 'admin' ?
            <form onSubmit={e => {
              e.preventDefault();
              onFormSubmit();
            }} className={'LoginCard--form'}>
              <FormItem top={'Логин'} status={showFormErrors && !login ? 'error' : 'default'}>
                <Input
                  before={<Icon16UserOutline/>}
                  placeholder={'Логин'}
                  value={login}
                  onChange={e => {
                    setLogin(e.target.value);
                    setShowFormErrors(false);
                  }}
                />
              </FormItem>

              <FormItem top={'Пароль'} status={showFormErrors && !password ? 'error' : 'default'}>
                <Input
                  before={<Icon16LockOutline/>}
                  placeholder={'Пароль'}
                  value={password}
                  type={'password'}
                  onChange={e => {
                    setPassword(e.target.value);
                    setShowFormErrors(false);
                  }}
                />
              </FormItem>
            </form>
            :
            <form onSubmit={e => {
              e.preventDefault();
              onFormSubmit();
            }} className={'LoginCard--form'}>
              <FormItem top={'Секретный ключ'} status={showFormErrors && !login ? 'error' : 'default'}>
                <Input
                  before={<Icon16KeyOutline/>}
                  placeholder={'Секретный ключ'}
                  value={login}
                  onChange={e => {
                    setLogin(e.target.value);
                    setShowFormErrors(false);
                  }}
                />
              </FormItem>
            </form>
          }

          <Div>
            <Button size={'l'} stretched onClick={onFormSubmit}>
              Войти
            </Button>
          </Div>

          <Div>
            <Button mode={'tertiary'} stretched onClick={toggleAccountType}>
              Войти как {selectedAccountType === 'admin' ? 'тренер' : 'администратор'}
            </Button>
          </Div>
        </Card>
      </div>
    </Panel>
  )
}