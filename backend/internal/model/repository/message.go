package repository


import (
	"database/sql"

	"backend/internal/core/db"
	"backend/internal/model/entity"
)


type MessageRepository interface {
	Insert(m *entity.Message) error
	Select(id int) (entity.Message, error)
	Update(id int, m *entity.Message) error
	Delete(id int) error
	UpdateRead(sendFrom, sendTo int) error
}


type messageRepository struct {
	db *sql.DB
}


func NewMessageRepository() MessageRepository {
	db := db.GetDB()
	return &messageRepository{db}
}


func (rep *messageRepository) Insert(m *entity.Message) error {
	_, err := rep.db.Exec(
		`INSERT INTO message (
			message,
			send_from,
			send_to
		 ) VALUES(?,?,?)`,
		m.Message,
		m.SendFrom,
		m.SendTo,
	)

	return err
}


func (rep *messageRepository) Select(id int) (entity.Message, error) {
	var ret entity.Message

	err := rep.db.QueryRow(
		`SELECT
			message_id,
			message,
			send_from,
			send_to,
			create_at,
			update_at
		 FROM message
		 WHERE message_id = ?`,
		id,
	).Scan(
		&ret.MessageId,
		&ret.Message,
		&ret.SendFrom,
		&ret.SendTo,
		&ret.CreateAt,
		&ret.UpdateAt,
	)

	return ret, err
}


func (rep *messageRepository) Update(id int, m *entity.Message) error {
	_, err := rep.db.Exec(
		`UPDATE message
		 SET
			message = ?
		 FROM message
		 WHERE message_id = ?`,
		m.Message,
		id,
	)

	return err
}


func (rep *messageRepository) Delete(id int) error {
	_, err := rep.db.Exec(
		`DELETE FROM message
		 WHERE message_id = ?`,
		id,
	)

	return err
}


func (rep *messageRepository) UpdateRead(sendFrom, sendTo int) error {
	_, err := rep.db.Exec(
		`UPDATE message
		 SET read = 1
		 WHERE send_from = ?
		   AND send_to = ?
		   AND read = 0`,
		sendFrom,
		sendTo,
	)

	return err
}