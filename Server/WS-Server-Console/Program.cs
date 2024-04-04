using Fleck;

var socketServer = new WebSocketServer(location: "ws//0.0.0.0:8181");

socketServer.Start(connection =>
{
    Console.WriteLine("Sever socket ON");
    connection.OnMessage = message =>
    {
        Console.WriteLine(message);
    };
});


Console.ReadKey();

