package query

import (
	"database/sql"

	"inquiry-chat/internal/core/db"
	"inquiry-chat/internal/model/entity"
)


type MessageQuery interface {
	SelectMessages(userId1, userId2 int) ([]entity.Message, error)
	SelectNewMessagesCount(sendFrom, sendTo int) (int, error)
}


type messageQuery struct {
	db *sql.DB
}


func NewMessageQuery() MessageQuery {
	db := db.GetDB()
	return &messageQuery{db}
}


func (que *messageQuery) SelectMessages(userId1, userId2 int) ([]entity.Message, error) {
	var ret []entity.Message

	rows, err := que.db.Query(
		`SELECT
			message_id,
			message,
			send_from,
			send_to,
			create_at
		 FROM message
		 WHERE (send_to = ? AND send_from = ?)
		    OR (send_from = ? AND send_to = ?)
		 ORDER BY create_at`,
		userId1,
		userId2,
		userId1,
		userId2,
	)

	if err != nil {
		return nil, err
	}

	for rows.Next() {
		m := entity.Message{}

		err = rows.Scan(
			&m.MessageId,
			&m.Message,
			&m.SendFrom,
			&m.SendTo,
			&m.CreateAt,
		)
		if err != nil {
			break
		}
		ret = append(ret, m)
	}

	return ret, err
}


func (que *messageQuery) SelectNewMessagesCount(sendFrom, sendTo int) (int, error) {
	var count int

	err := que.db.QueryRow(
		`SELECT
			count(1)
		 FROM message
		 WHERE send_from = ?
		   AND send_to = ?
		   AND read = 0`,
		sendFrom,
		sendTo,
	).Scan(
		&count,
	)

	return count, err
}