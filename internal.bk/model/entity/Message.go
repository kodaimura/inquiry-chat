package entity


type Message struct {
	MessageId int `db:"message_id" json:"message_id"`
	Message string `db:"message" json:"message"`
	SendFrom int `db:"send_from" json:"send_from"`
	SendTo int `db:"send_to" json:"send_to"`
	CreateAt string `db:"create_at" json:"create_at"`
	UpdateAt string `db:"update_at" json:"update_at"`
}