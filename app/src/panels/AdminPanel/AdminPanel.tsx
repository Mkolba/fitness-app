import './style.scss'
import React, {useEffect, useState} from "react";
import {CardGrid, Group, Header, Link, Panel, PanelProps, Placeholder, Spinner} from "@vkontakte/vkui";
import {
  ClientInfoBlock,
  CommonPanelHeader,
  ProtectedPanel,
  ProtectedPanelProps,
  TrainerInfoBlock
} from "../../components";
import {WorkoutCard} from "../../components/WorkoutCard/WorkoutCard";
import {IClient, IWorkout} from "../../types";
import {api} from "../../api";
import {useParams} from "@vkontakte/vk-mini-apps-router";
import {AdminInfoBlock} from "../../components/AdminInfoBlock/AdminInfoBlock";

export const AdminPanel: React.FC<ProtectedPanelProps> = ({
 nav,
 redirectTo
}) => {
  // @ts-ignore
  const {id: adminId} = useParams()

  const [admin, setAdmin] = useState<IClient | null>(null); // TODO: change type to IAdmin
  const [isFetching, setIsFetching] = useState(true);

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


  return (
    <ProtectedPanel nav={nav} redirectTo={redirectTo}>
      {admin ?
        <>
          <CommonPanelHeader>
            Карточка клиента
          </CommonPanelHeader>

          <AdminInfoBlock admin={admin} editable/>
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