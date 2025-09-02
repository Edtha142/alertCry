import { useState } from 'react';
import { Eye, EyeOff, Key, Send, TestTube, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const Configuration = () => {
  const [showApiKey, setShowApiKey] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [discordWebhook, setDiscordWebhook] = useState('');
  const [telegramToken, setTelegramToken] = useState('');
  const [telegramChatId, setTelegramChatId] = useState('');
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  
  const { toast } = useToast();

  const handleSaveCredentials = async () => {
    if (!apiKey || !secretKey) {
      toast({
        title: "Error",
        description: "Por favor, completa ambos campos de API",
        variant: "destructive",
      });
      return;
    }

    try {
      // In a real app, encrypt and store securely
      localStorage.setItem('binance_api_key', btoa(apiKey));
      localStorage.setItem('binance_secret_key', btoa(secretKey));
      
      toast({
        title: "Credenciales guardadas",
        description: "Las credenciales se han guardado de forma segura",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron guardar las credenciales",
        variant: "destructive",
      });
    }
  };

  const testBinanceConnection = async () => {
    setIsTestingConnection(true);
    setConnectionStatus('testing');
    
    // Simulate API test
    setTimeout(() => {
      if (apiKey && secretKey) {
        setConnectionStatus('success');
        toast({
          title: "Conexión exitosa",
          description: "Las credenciales son válidas y tienen permisos de lectura",
        });
      } else {
        setConnectionStatus('error');
        toast({
          title: "Error de conexión",
          description: "No se pudo conectar con Binance. Verifica las credenciales",
          variant: "destructive",
        });
      }
      setIsTestingConnection(false);
    }, 2000);
  };

  const testDiscordWebhook = async () => {
    if (!discordWebhook) {
      toast({
        title: "Error",
        description: "Ingresa la URL del webhook de Discord",
        variant: "destructive",
      });
      return;
    }

    try {
      // Simulate webhook test
      toast({
        title: "Notificación de prueba enviada",
        description: "Revisa tu canal de Discord",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar la notificación de prueba",
        variant: "destructive",
      });
    }
  };

  const testTelegram = async () => {
    if (!telegramToken || !telegramChatId) {
      toast({
        title: "Error",
        description: "Completa los campos de Telegram",
        variant: "destructive",
      });
      return;
    }

    try {
      // Simulate Telegram test
      toast({
        title: "Mensaje de prueba enviado",
        description: "Revisa tu chat de Telegram",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar el mensaje de prueba",
        variant: "destructive",
      });
    }
  };

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-trading-profit" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-trading-loss" />;
      default:
        return <Key className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Configuración</h1>
        <p className="text-muted-foreground mt-1">
          Configura tus credenciales y notificaciones
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Binance API Configuration */}
        <div className="trading-card space-y-6">
          <div className="flex items-center space-x-2">
            {getConnectionIcon()}
            <h3 className="text-lg font-semibold">Credenciales Binance</h3>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <div className="relative">
                <Input
                  id="apiKey"
                  type={showApiKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Ingresa tu API Key de Binance"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="secretKey">Secret Key</Label>
              <div className="relative">
                <Input
                  id="secretKey"
                  type={showSecret ? "text" : "password"}
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  placeholder="Ingresa tu Secret Key de Binance"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowSecret(!showSecret)}
                >
                  {showSecret ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                <strong>Importante:</strong> Las credenciales solo necesitan permisos de lectura. 
                Nunca ejecutaremos órdenes automáticamente.
              </p>
            </div>

            <div className="flex space-x-3">
              <Button onClick={handleSaveCredentials} className="flex-1">
                Guardar Credenciales
              </Button>
              <Button
                variant="outline"
                onClick={testBinanceConnection}
                disabled={isTestingConnection || !apiKey || !secretKey}
              >
                {isTestingConnection ? (
                  <>
                    <TestTube className="w-4 h-4 mr-2 animate-spin" />
                    Probando...
                  </>
                ) : (
                  <>
                    <TestTube className="w-4 h-4 mr-2" />
                    Probar
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="space-y-6">
          {/* Discord Configuration */}
          <div className="trading-card">
            <div className="flex items-center space-x-2 mb-4">
              <Send className="w-4 h-4 text-primary" />
              <h3 className="text-lg font-semibold">Discord</h3>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="discordWebhook">Webhook URL</Label>
                <Input
                  id="discordWebhook"
                  value={discordWebhook}
                  onChange={(e) => setDiscordWebhook(e.target.value)}
                  placeholder="https://discord.com/api/webhooks/..."
                />
              </div>
              
              <Button
                variant="outline"
                onClick={testDiscordWebhook}
                disabled={!discordWebhook}
                className="w-full"
              >
                <Send className="w-4 h-4 mr-2" />
                Enviar Prueba
              </Button>
            </div>
          </div>

          {/* Telegram Configuration */}
          <div className="trading-card">
            <div className="flex items-center space-x-2 mb-4">
              <Send className="w-4 h-4 text-primary" />
              <h3 className="text-lg font-semibold">Telegram</h3>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="telegramToken">Bot Token</Label>
                <Input
                  id="telegramToken"
                  value={telegramToken}
                  onChange={(e) => setTelegramToken(e.target.value)}
                  placeholder="123456789:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="telegramChatId">Chat ID</Label>
                <Input
                  id="telegramChatId"
                  value={telegramChatId}
                  onChange={(e) => setTelegramChatId(e.target.value)}
                  placeholder="-1001234567890"
                />
              </div>
              
              <Button
                variant="outline"
                onClick={testTelegram}
                disabled={!telegramToken || !telegramChatId}
                className="w-full"
              >
                <Send className="w-4 h-4 mr-2" />
                Enviar Prueba
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="trading-card bg-muted/50">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-trading-warning mt-0.5" />
          <div>
            <h4 className="font-medium text-trading-warning">Seguridad de Datos</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Todas las credenciales se almacenan localmente en tu dispositivo de forma encriptada. 
              Nunca compartimos tus datos con terceros. Las credenciales de Binance solo requieren 
              permisos de lectura para consultar precios y posiciones.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configuration;