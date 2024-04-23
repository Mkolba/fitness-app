import './style.scss'
import React, {useEffect, useState} from "react";
import {
  Alert,
  Button,
  Div,
  Group,
  Placeholder,
  Spinner
} from "@vkontakte/vkui";
import {
  CommonPanelHeader,
  ProtectedPanel,
  ProtectedPanelProps,
} from "../../components";
import {IAdmin} from "../../types";
import {api} from "../../api";
import {useParams, useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {AdminInfoBlock} from "../../components";

export const AdminPanel: React.FC<ProtectedPanelProps> = ({
 nav,
 redirectTo
}) => {
  // @ts-ignore
  const {id: adminId} = useParams()

  const [admin, setAdmin] = useState<IAdmin | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [isMe] = useState(api.getToken().payload.UserID === Number(adminId))

  const router = useRouteNavigator();

  useEffect(() => {
    if (adminId) {
      setIsFetching(true);
      api.getAdmin(Number(adminId)).then(data => {
        setIsFetching(false);
        setAdmin(data)
      }).catch(() => {
        setIsFetching(false);
      })
    }
  }, [adminId])

  const showDeleteAdminAlert = () => {
    router.showPopout(
      <Alert
        onClose={() => router.hidePopout()}
        header={'Подтвердите действие'}
        text={'Вы действительно хотите удалить администратора?'}
        actions={[
          {
            title: 'Удалить',
            mode: 'destructive',
            action: deleteAdmin
          },
          {
            title: 'Отмена',
            mode: 'cancel',
          },
        ]}
      />
    )
  }

  const deleteAdmin = () => {
    api.deleteAdmin(Number(adminId)).then(() => {
      router.back();
    }).catch((e) => {
      router.showPopout(
        <Alert
          onClose={() => router.hidePopout()}
          header={'Произошла ошибка'}
          text={JSON.stringify(e)}
        />
      )
    })
  }


  return (
    <ProtectedPanel nav={nav} redirectTo={redirectTo}>
      {admin ?
        <>
          <CommonPanelHeader>
            Карточка администратора
          </CommonPanelHeader>

          <AdminInfoBlock admin={admin} editable={false}/> {/* Нет функционала edit на API */}
          { !isMe &&
            <Group>
              <Div>
                <Button appearance={'negative'} stretched size={'m'} onClick={showDeleteAdminAlert}>
                  Удалить администратора
                </Button>
              </Div>
            </Group>
          }
        </>
        : isFetching &&
        <>
          <CommonPanelHeader>
            Загрузка...
          </CommonPanelHeader>
          <Group>
            <Placeholder icon={<Spinner/>}/>
          </Group>
        </>
      }
    </ProtectedPanel>
  )
}