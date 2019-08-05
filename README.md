# Namespaces

namespaceを使用すると複数のエンドポイントを作れる

## 特定のチャンネルにいる人に発火

io.sockets.emit('hi', 'everyone');

## すべてのチャンネルのいる人に発火

io.emit('hi', 'everyone');

## socket.broadcat()は自分以外全員

## io.emit()は自分含め全員

## namespaceに関係なく全員にメッセージを送る方法はある？