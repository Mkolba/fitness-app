import React, {useState} from "react";
import {IClient} from "../../types";
import {api} from "../../api";
import {CustomSelect} from "@vkontakte/vkui";

interface IClientOption {
  label: string,
  value: string,
}

interface ClientSelectProps {
  client?: IClient
  onChange: (client: IClient) => void,
  status?: 'default' | 'error' | 'valid'
}

export const ClientSelect: React.FC<ClientSelectProps> = ({
  client,
  onChange,
  status='default'
}) => {
  const [clients, setClients] = useState<IClient[]>([]);
  const [clientOptions, setClientOptions] = useState<IClientOption[]>(client ? [
    {
      value: `${client.id}`,
      label: `${client.first_name} ${client.last_name}`
    }
  ] : [])
  const [clientsFetching, setClientsFetching] = useState(false);

  const fetchClients = () => {
    if (!clients.length) {
      setClientsFetching(true);
      api.getClients().then(data => {
        setClientsFetching(false);
        setClients(data);
        setClientOptions(data.map(item => ({
          label: `${item.first_name} ${item.last_name}`,
          value: `${item.id}`
        })));
      }).catch(e => {
        setClientsFetching(false);
        console.log(e)
      })
    }
  }

  return (
    <CustomSelect
      aria-label={'Клиент'}
      value={client ? `${client.id}` : undefined}
      options={clientOptions}
      onChange={e => onChange(
        clients.filter(item => `${item.id}` === e.target.value)[0]
      )}
      status={status}
      searchable
      placeholder={'Введите имя клиента'}
      disabled={clientsFetching}
      fetching={clientsFetching}
      onOpen={fetchClients}
    />
  )
}