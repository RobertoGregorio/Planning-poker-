using Fleck;


var server = new WebSocketServer("ws://0.0.0.0:8181");

var connections = new List<IWebSocketConnection>();

server.Start(socket =>
{
    socket.OnOpen = () =>
    {
        connections.Add(socket);
        Console.WriteLine("Open!");
    };
    socket.OnClose = () => Console.WriteLine("Close!");

    socket.OnMessage = message =>
    {
        foreach (var connection in connections)
        {
            if (connection.ConnectionInfo.Id == socket.ConnectionInfo.Id)
                continue;

            connection.Send(message);
        }
    };
});


WebApplication.CreateBuilder(args).Build().Run();