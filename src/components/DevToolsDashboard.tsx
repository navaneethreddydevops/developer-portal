"use client";
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Settings, Code, Database, Terminal, Package, Key, Calendar } from 'lucide-react';

const DevToolsDashboard: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [activeConverter, setActiveConverter] = useState('json');

  // Utility functions embedded within component
  const utils = {
    base64: {
      encode: (str: string): string => {
        try {
          return btoa(str);
        } catch (e) {
          return "Invalid input for Base64 encoding";
        }
      },
      decode: (str: string): string => {
        try {
          return atob(str);
        } catch (e) {
          return "Invalid Base64 string";
        }
      }
    },
    url: {
      encode: (str: string): string => {
        try {
          return encodeURIComponent(str);
        } catch (e) {
          return "Invalid input for URL encoding";
        }
      },
      decode: (str: string): string => {
        try {
          return decodeURIComponent(str);
        } catch (e) {
          return "Invalid URL encoded string";
        }
      }
    },
    jwt: (token: string): string => {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.stringify(JSON.parse(window.atob(base64)), null, 2);
      } catch (e) {
        return "Invalid JWT token";
      }
    },
    hash: async (str: string): Promise<string> => {
      try {
        const msgBuffer = new TextEncoder().encode(str);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      } catch (e) {
        return "Error generating hash";
      }
    },
    generateRandom: (length: number): string => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      return Array.from(crypto.getRandomValues(new Uint8Array(length)))
        .map((x) => chars[x % chars.length])
        .join('');
    }
  };
  
  const handleConversion = async () => {
    switch (activeConverter) {
      case 'json':
        try {
          setOutput(JSON.stringify(JSON.parse(input), null, 2));
        } catch (e) {
          setOutput('Invalid JSON: ' + e.message);
        }
        break;
      case 'base64':
        setOutput(utils.base64.encode(input));
        break;
      case 'base64decode':
        setOutput(utils.base64.decode(input));
        break;
      case 'url':
        setOutput(utils.url.encode(input));
        break;
      case 'urldecode':
        setOutput(utils.url.decode(input));
        break;
      case 'jwt':
        setOutput(utils.jwt(input));
        break;
      case 'hash':
        setOutput(await utils.hash(input));
        break;
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Developer Tools Dashboard</h1>
      
      <Tabs defaultValue="converters" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-4">
          <TabsTrigger value="converters">
            <Code className="w-4 h-4 mr-2" />
            Converters
          </TabsTrigger>
          <TabsTrigger value="generators">
            <Key className="w-4 h-4 mr-2" />
            Generators
          </TabsTrigger>
          <TabsTrigger value="config">
            <Settings className="w-4 h-4 mr-2" />
            Config
          </TabsTrigger>
          <TabsTrigger value="database">
            <Database className="w-4 h-4 mr-2" />
            Database
          </TabsTrigger>
          <TabsTrigger value="deploy">
            <Terminal className="w-4 h-4 mr-2" />
            Deploy
          </TabsTrigger>
        </TabsList>

        <TabsContent value="converters">
          <Card>
            <CardHeader>
              <CardTitle>Data Converters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant={activeConverter === 'json' ? 'default' : 'outline'}
                      onClick={() => setActiveConverter('json')}
                    >
                      JSON
                    </Button>
                    <Button 
                      variant={activeConverter === 'base64' ? 'default' : 'outline'}
                      onClick={() => setActiveConverter('base64')}
                    >
                      Base64 Encode
                    </Button>
                    <Button 
                      variant={activeConverter === 'base64decode' ? 'default' : 'outline'}
                      onClick={() => setActiveConverter('base64decode')}
                    >
                      Base64 Decode
                    </Button>
                    <Button 
                      variant={activeConverter === 'url' ? 'default' : 'outline'}
                      onClick={() => setActiveConverter('url')}
                    >
                      URL Encode
                    </Button>
                    <Button 
                      variant={activeConverter === 'urldecode' ? 'default' : 'outline'}
                      onClick={() => setActiveConverter('urldecode')}
                    >
                      URL Decode
                    </Button>
                    <Button 
                      variant={activeConverter === 'jwt' ? 'default' : 'outline'}
                      onClick={() => setActiveConverter('jwt')}
                    >
                      JWT Decode
                    </Button>
                    <Button 
                      variant={activeConverter === 'hash' ? 'default' : 'outline'}
                      onClick={() => setActiveConverter('hash')}
                    >
                      Hash (SHA-256)
                    </Button>
                  </div>
                  <Textarea 
                    placeholder="Input data..."
                    className="h-48 font-mono"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                  <Button onClick={handleConversion}>Convert</Button>
                </div>
                <div>
                  <Textarea 
                    readOnly
                    className="h-64 font-mono"
                    value={output}
                    placeholder="Output will appear here..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="generators">
          <Card>
            <CardHeader>
              <CardTitle>Generators & Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <h3 className="font-semibold mb-2">Random String Generator</h3>
                  <div className="space-y-2">
                    <Button onClick={() => setOutput(utils.generateRandom(32))}>
                      Generate Random String
                    </Button>
                  </div>
                </Card>
                <Card className="p-4">
                  <h3 className="font-semibold mb-2">Date Tools</h3>
                  <div className="space-y-2">
                    <Button onClick={() => setOutput(new Date().toISOString())}>
                      <Calendar className="w-4 h-4 mr-2" />
                      Format Current Date
                    </Button>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config">
          <Card>
            <CardHeader>
              <CardTitle>Project Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Card className="p-4">
                  <h3 className="font-semibold">Environment Variables</h3>
                  <p className="text-sm text-gray-600 mt-1">Manage your .env files</p>
                  <Button className="mt-2">Edit Environment Variables</Button>
                </Card>
                <Card className="p-4">
                  <h3 className="font-semibold">TypeScript Config</h3>
                  <p className="text-sm text-gray-600 mt-1">tsconfig.json settings</p>
                  <Button className="mt-2">Edit TypeScript Config</Button>
                </Card>
                <Card className="p-4">
                  <h3 className="font-semibold">Next.js Config</h3>
                  <p className="text-sm text-gray-600 mt-1">next.config.js settings</p>
                  <Button className="mt-2">Edit Next.js Config</Button>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database">
          <Card>
            <CardHeader>
              <CardTitle>Database Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <h3 className="font-semibold">Database Operations</h3>
                  <div className="space-y-2 mt-2">
                    <Button className="w-full justify-start">
                      <Terminal className="w-4 h-4 mr-2" />
                      Open Database CLI
                    </Button>
                    <Button className="w-full justify-start">
                      <Database className="w-4 h-4 mr-2" />
                      View Schema
                    </Button>
                  </div>
                </Card>
                <Card className="p-4">
                  <h3 className="font-semibold">Migrations</h3>
                  <div className="space-y-2 mt-2">
                    <Button className="w-full justify-start">
                      Generate Migration
                    </Button>
                    <Button className="w-full justify-start">
                      Run Migrations
                    </Button>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deploy">
          <Card>
            <CardHeader>
              <CardTitle>Deployment Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <h3 className="font-semibold">Build & Deploy</h3>
                  <div className="space-y-2 mt-2">
                    <Button className="w-full justify-start">
                      <Package className="w-4 h-4 mr-2" />
                      Build Project
                    </Button>
                    <Button className="w-full justify-start">
                      Run Type Check
                    </Button>
                    <Button className="w-full justify-start">
                      Run Linter
                    </Button>
                  </div>
                </Card>
                <Card className="p-4">
                  <h3 className="font-semibold">Monitoring</h3>
                  <div className="space-y-2 mt-2">
                    <Button className="w-full justify-start">
                      View Logs
                    </Button>
                    <Button className="w-full justify-start">
                      Performance Metrics
                    </Button>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DevToolsDashboard;