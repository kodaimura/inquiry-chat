package query

import (
	"database/sql"

	"inquiry-chat/internal/core/db"
	"inquiry-chat/internal/model/entity"
)


type MessageQuery interface {
	SelectMessagesWithAdmin(userId int) ([]entity.Message, error)
}


type messageQuery struct {
	db *sql.DB
}


func NewMessageQuery() MessageQuery {
	db := db.GetDB()
	return &messageQuery{db}
}


func (que *messageQuery) SelectMessagesWithAdmin(userId int) ([]entity.Message, error) {
	var ret []entity.Message

	rows, err := que.db.Query(
		`SELECT
			message_id,
			message,
			send_from,
			send_to,
			create_at
		 FROM message
		 WHERE (send_to = ? AND send_from in (select user_id from admin))
		    OR (send_from = ? AND send_to in (select user_id from admin))
		 ORDER BY create_at`,
		userId,
		userId,
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