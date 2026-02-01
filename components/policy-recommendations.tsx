"use client"

import { analisarTodasPoliticas } from "@/lib/policy-analysis"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function PolicyRecommendations() {
  const analises = analisarTodasPoliticas().sort((a, b) => b.roiAno5 - a.roiAno5)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Políticas Prioritárias (ROI 5 anos)</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Política</TableHead>
              <TableHead>Setor</TableHead>
              <TableHead>ROI 5 anos</TableHead>
              <TableHead>Payback</TableHead>
              <TableHead>Viabilidade</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {analises.map((a) => (
              <TableRow key={a.politica.id}>
                <TableCell>{a.politica.nome}</TableCell>
                <TableCell>{a.politica.setor}</TableCell>
                <TableCell>{a.roiAno5.toFixed(1)}%</TableCell>
                <TableCell>{a.payback.toFixed(1)} anos</TableCell>
                <TableCell className="uppercase">{a.viabilidade}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
